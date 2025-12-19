/**
 * Centralized image path utilities
 * Add new image paths here as you add more images to the project
 */

export const IMAGE_PATHS = {
  avatars: {
    default: "/images/avatars/avatar-female.png",
    // Add more avatar images here as needed:
    // user1: "/images/avatars/user1.jpg",
    // user2: "/images/avatars/user2.jpg",
  },
  // Add other image categories here as needed:
  // components: {
  //   example: "/images/components/example.png",
  // },
} as const;

/**
 * Get avatar image path by key
 */
export function getAvatarImage(key: keyof typeof IMAGE_PATHS.avatars = "default"): string {
  return IMAGE_PATHS.avatars[key];
}

