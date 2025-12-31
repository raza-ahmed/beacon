# Avatar Images

This directory contains avatar images used in the design system.

## Adding New Avatar Images

1. Place your image file in this directory (supported formats: JPG, PNG, WebP)
2. Update `src/utils/imagePaths.ts` to add your new image:

```typescript
export const IMAGE_PATHS = {
  avatars: {
    default: "/images/avatars/avatar-female.png",
    user1: "/images/avatars/user1.jpg", // Add your new image here
    user2: "/images/avatars/user2.jpg",
  },
};
```

3. Use the image in your code:

```typescript
import { getAvatarImage } from "@/utils/imagePaths";

// Use the default image
const imageUrl = getAvatarImage("default");

// Or use a specific image
const imageUrl = getAvatarImage("user1");
```

## Image Guidelines

- Recommended size: 400x400px or larger (square aspect ratio)
- Formats: JPG, PNG, or WebP
- Keep file sizes reasonable for web performance
- Use consistent naming conventions (e.g., `avatar-default.jpg`, `user1.jpg`)

## Current Images

- `avatar-default.jpg` - Default avatar image (add this file)

