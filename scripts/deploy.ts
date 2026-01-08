/**
 * Deployment script for GoDaddy hosting via FTP
 * 
 * This script:
 * 1. Builds the Next.js project
 * 2. Uploads all files from the out folder directly to FTP server
 * 3. Maintains directory structure
 * 4. Optionally deletes remote files not in the build
 */

import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";
import { Client, FileInfo } from "basic-ftp";

const OUT_DIR = path.join(__dirname, "../out");
const CONFIG_PATH = path.join(__dirname, "../deploy.config.json");

interface DeployConfig {
  ftp: {
    host: string;
    user: string;
    password: string;
    remotePath: string;
    port?: number;
    secure?: boolean;
  };
  options?: {
    deleteRemote?: boolean;
    dryRun?: boolean;
  };
}

async function loadConfig(): Promise<DeployConfig> {
  if (!fs.existsSync(CONFIG_PATH)) {
    console.error("❌ deploy.config.json not found!");
    console.error("   Please create deploy.config.json with your FTP credentials.");
    process.exit(1);
  }

  try {
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
    
    if (!config.ftp || !config.ftp.host || !config.ftp.user || !config.ftp.password) {
      console.error("❌ Invalid deploy.config.json!");
      console.error("   Required fields: ftp.host, ftp.user, ftp.password, ftp.remotePath");
      process.exit(1);
    }

    return {
      ftp: {
        host: config.ftp.host,
        user: config.ftp.user,
        password: config.ftp.password,
        remotePath: config.ftp.remotePath || "/public_html",
        port: config.ftp.port || 21,
        secure: config.ftp.secure || false,
      },
      options: {
        deleteRemote: config.options?.deleteRemote || false,
        dryRun: config.options?.dryRun || false,
      },
    };
  } catch (error) {
    console.error("❌ Failed to read deploy.config.json:", error);
    process.exit(1);
  }
}

async function buildProject() {
  console.log("🔨 Building project...");
  try {
    // Run build steps individually, skipping CSS validation for deployment
    console.log("  → Building tokens...");
    execSync("npm run build:tokens", { stdio: "inherit", cwd: path.join(__dirname, "..") });
    
    console.log("  → Copying assets...");
    execSync("npm run copy:assets", { stdio: "inherit", cwd: path.join(__dirname, "..") });
    
    console.log("  → Building Next.js...");
    execSync("next build", { stdio: "inherit", cwd: path.join(__dirname, "..") });
    
    console.log("✅ Build completed successfully\n");
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

function getAllFiles(dir: string, baseDir: string = dir): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, baseDir));
    } else {
      files.push(relativePath);
    }
  }

  return files;
}

async function uploadFiles(client: Client, config: DeployConfig) {
  if (!fs.existsSync(OUT_DIR)) {
    console.error(`❌ Build output directory not found: ${OUT_DIR}`);
    console.error("   Please run 'npm run build' first.");
    process.exit(1);
  }

  console.log("📤 Uploading files...");
  
  const files = getAllFiles(OUT_DIR);
  const totalFiles = files.length;
  let uploadedCount = 0;
  let failedCount = 0;

  // Normalize remotePath - if it's ".", use empty string for root
  const baseRemotePath = config.ftp.remotePath === "." ? "" : config.ftp.remotePath.replace(/\\/g, "/");
  
  // Get the root directory (where we start)
  let currentRemoteDir = "";
  if (!config.options?.dryRun) {
    if (baseRemotePath) {
      try {
        await client.cd(baseRemotePath);
        currentRemoteDir = baseRemotePath;
      } catch (error) {
        await client.ensureDir(baseRemotePath);
        await client.cd(baseRemotePath);
        currentRemoteDir = baseRemotePath;
      }
    } else {
      // Stay in root, get current directory
      currentRemoteDir = await client.pwd();
    }
  }

  for (const file of files) {
    const localPath = path.join(OUT_DIR, file);
    const fileDir = path.dirname(file).replace(/\\/g, "/");
    const fileName = path.basename(file);

    try {
      if (config.options?.dryRun) {
        const remotePath = baseRemotePath 
          ? `${baseRemotePath}/${file}`.replace(/\/+/g, "/")
          : file.replace(/\\/g, "/");
        console.log(`[DRY RUN] Would upload: ${file} -> ${remotePath}`);
        uploadedCount++;
      } else {
        // Build the full remote directory path
        const fullRemoteDir = fileDir && fileDir !== "."
          ? (currentRemoteDir ? `${currentRemoteDir}/${fileDir}` : fileDir).replace(/\/+/g, "/")
          : currentRemoteDir;
        
        // Build the full remote file path
        const fullRemotePath = fileDir && fileDir !== "."
          ? `${fullRemoteDir}/${fileName}`.replace(/\/+/g, "/")
          : (currentRemoteDir ? `${currentRemoteDir}/${fileName}` : fileName).replace(/\/+/g, "/");

        // Ensure the directory exists using absolute path
        if (fileDir && fileDir !== ".") {
          try {
            await client.ensureDir(fullRemoteDir);
          } catch (dirError: any) {
            // If ensureDir fails, try creating directories manually
            const dirParts = fileDir.split("/").filter(part => part !== "");
            let buildPath = currentRemoteDir || "";
            
            for (const part of dirParts) {
              buildPath = buildPath ? `${buildPath}/${part}` : part;
              try {
                await client.ensureDir(buildPath);
              } catch (partError: any) {
                // Directory might already exist, continue
                if (partError?.code !== 550 && partError?.code !== 553) {
                  console.warn(`   Warning: Could not create directory ${buildPath}:`, partError.message);
                }
              }
            }
          }
        }

        // Upload the file using the full path
        await client.uploadFrom(localPath, fullRemotePath);
        uploadedCount++;
        
        if (uploadedCount % 10 === 0 || uploadedCount === totalFiles) {
          process.stdout.write(`\r   Progress: ${uploadedCount}/${totalFiles} files uploaded`);
        }
      }
    } catch (error) {
      failedCount++;
      console.error(`\n❌ Failed to upload ${file}:`, error);
    }
  }

  console.log(`\n✅ Upload completed: ${uploadedCount} files uploaded`);
  if (failedCount > 0) {
    console.log(`⚠️  ${failedCount} files failed to upload`);
  }
}

async function deleteRemoteFiles(client: Client, config: DeployConfig, localFiles: string[]) {
  if (config.options?.dryRun) {
    console.log("\n[DRY RUN] Would check for remote files to delete");
    return;
  }

  console.log("\n🧹 Checking for remote files to delete...");
  
  try {
    const baseRemotePath = config.ftp.remotePath === "." ? "" : config.ftp.remotePath.replace(/\\/g, "/");
    const remoteFiles = await getAllRemoteFiles(client, baseRemotePath);
    const localFileSet = new Set(localFiles.map(f => f.replace(/\\/g, "/")));
    
    const filesToDelete = remoteFiles.filter(
      (file) => !localFileSet.has(file) && !file.endsWith("/")
    );

    if (filesToDelete.length === 0) {
      console.log("✅ No remote files to delete");
      return;
    }

    console.log(`   Found ${filesToDelete.length} remote files not in build`);
    
    for (const file of filesToDelete) {
      try {
        const remotePath = baseRemotePath 
          ? `${baseRemotePath}/${file}`.replace(/\/+/g, "/")
          : file.replace(/\\/g, "/");
        await client.remove(remotePath);
      } catch (error) {
        console.error(`   ⚠️  Failed to delete ${file}:`, error);
      }
    }

    console.log(`✅ Cleanup completed`);
  } catch (error) {
    console.error("⚠️  Failed to cleanup remote files:", error);
  }
}

async function getAllRemoteFiles(client: Client, remotePath: string): Promise<string[]> {
  const files: string[] = [];
  
  try {
    // Use "." for listing current directory if remotePath is empty
    const listPath = remotePath === "" ? "." : remotePath;
    const list = await client.list(listPath);
    
    for (const item of list) {
      const itemPath = remotePath === "" 
        ? item.name 
        : `${remotePath}/${item.name}`.replace(/\/+/g, "/");
      const relativePath = remotePath === ""
        ? item.name
        : path.relative(remotePath, itemPath).replace(/\\/g, "/");
      
      if (item.isFile) {
        files.push(relativePath);
      } else if (item.isDirectory && item.name !== "." && item.name !== "..") {
        const subFiles = await getAllRemoteFiles(client, itemPath);
        files.push(...subFiles.map(f => {
          if (remotePath === "") {
            return `${relativePath}/${f}`.replace(/\/+/g, "/");
          }
          return path.join(relativePath, f).replace(/\\/g, "/");
        }));
      }
    }
  } catch (error) {
    // Directory might not exist or be empty
  }
  
  return files;
}

async function main() {
  const config = await loadConfig();

  if (config.options?.dryRun) {
    console.log("🔍 DRY RUN MODE - No files will be uploaded\n");
  }

  await buildProject();

  const client = new Client();
  client.ftp.verbose = false; // Set to true for debugging

  try {
    console.log("🔌 Connecting to FTP server...");
    console.log(`   Host: ${config.ftp.host}`);
    console.log(`   User: ${config.ftp.user}`);
    console.log(`   Port: ${config.ftp.port}`);
    
    await client.access({
      host: config.ftp.host,
      user: config.ftp.user,
      password: config.ftp.password,
      port: config.ftp.port,
      secure: config.ftp.secure,
    });
    console.log("✅ Connected successfully\n");

    const files = getAllFiles(OUT_DIR);
    await uploadFiles(client, config);

    if (config.options?.deleteRemote) {
      await deleteRemoteFiles(client, config, files);
    }

    console.log("\n✨ Deployment completed successfully!");
  } catch (error: any) {
    console.error("\n❌ Deployment failed!");
    
    if (error.code === 530) {
      console.error("   Authentication failed. Please check:");
      console.error("   - FTP username and password in deploy.config.json");
      console.error("   - FTP host address");
      console.error("   - Ensure FTP account is active in cPanel");
    } else if (error.code === 421 || error.message?.includes("timeout")) {
      console.error("   Connection timeout. Please check:");
      console.error("   - FTP host address");
      console.error("   - Port number (usually 21 for FTP)");
      console.error("   - Firewall/network settings");
    } else {
      console.error("   Error details:", error.message || error);
    }
    
    process.exit(1);
  } finally {
    client.close();
  }
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});
