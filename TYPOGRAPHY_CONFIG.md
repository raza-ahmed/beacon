# Typography Configuration

The Beacon Design System supports configurable primary and secondary fonts. You can choose which fonts are used as primary and secondary by editing `typography.config.json`.

## Available Fonts

The system includes four font families:

- **Inter** - Sans-serif
- **DM Sans** - Sans-serif  
- **IBM Plex Serif** - Serif
- **Geist Mono** - Monospace

## Configuration

Edit `typography.config.json` in the project root to change which fonts are used as primary and secondary:

```json
{
  "primary": {
    "font": "IBM_Plex_Serif",
    "fallback": "serif"
  },
  "secondary": {
    "font": "DM_Sans",
    "fallback": "sans-serif"
  }
}
```

### Font Keys

Use these keys to reference fonts:
- `Inter`
- `DM_Sans`
- `IBM_Plex_Serif`
- `Geist_Mono`

### Fallback Values

Set appropriate CSS fallback values:
- `serif` - For serif fonts
- `sans-serif` - For sans-serif fonts
- `monospace` - For monospace fonts

## Usage

After updating the configuration:

1. Rebuild tokens:
   ```bash
   npm run build:tokens
   ```

2. The CSS variables `--font-primary` and `--font-secondary` will be updated automatically.

3. All typography utility classes (`.text-heading-h1`, `.text-body3-regular`, etc.) will use the configured fonts.

## Examples

### Using Inter as Primary Font

```json
{
  "primary": {
    "font": "Inter",
    "fallback": "sans-serif"
  },
  "secondary": {
    "font": "DM_Sans",
    "fallback": "sans-serif"
  }
}
```

### Using Geist Mono as Secondary Font

```json
{
  "primary": {
    "font": "IBM_Plex_Serif",
    "fallback": "serif"
  },
  "secondary": {
    "font": "Geist_Mono",
    "fallback": "monospace"
  }
}
```

## How It Works

1. The build script (`scripts/build-tokens.ts`) reads `typography.config.json`
2. It generates CSS variables (`--font-primary`, `--font-secondary`) based on your selection
3. Font weight variables are automatically mapped to the selected fonts
4. Typography utility classes reference these variables, so they automatically use your configured fonts

## Notes

- The configuration file must be valid JSON
- Font keys must match exactly (case-sensitive)
- After changing the config, always run `npm run build:tokens` to regenerate CSS
- If a font doesn't have a bold weight (like IBM Plex Serif), the system will fall back to the default bold weight

