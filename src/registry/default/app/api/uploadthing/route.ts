import type { FileRouter } from 'uploadthing/next';

// Potion-only
// import { getRequestAuth } from '@/server/auth/getRequestAuth';
// import { prisma } from '@/server/db';
import { createRouteHandler, createUploadthing } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  editorUploader: f(['image', 'text', 'blob', 'pdf', 'video', 'audio'])
    // Set permissions and file types for this FileRoute
    .middleware(({ req }) => {
      // Mock: get the auth user
      const user = (req ? null : { id: '1' }) as { id: string } | null;
      // const { user } = await getRequestAuth(req);

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError('Unauthorized');

      // Mock: fetch from db
      const uploaded = { files: [{ size: 100 }], uploadLimit: 0 };
      // const uploaded = await prisma.user.findUnique({
      //   select: {
      //     files: {
      //       select: {
      //         size: true,
      //       },
      //     },
      //     uploadLimit: true,
      //   },
      //   where: {
      //     id: user.id,
      //   },
      // });

      if (!uploaded) throw new UploadThingError('Unauthorized');

      const { files, uploadLimit } = uploaded;

      const uploadedBytes = files.reduce((acc, file) => acc + file.size, 0);

      // 500MB
      if (uploadedBytes > uploadLimit)
        throw new UploadThingError('Reached the maximum upload limit.');

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { uploadedBytes, userId: user.id };
    })
    .onUploadComplete(({ file, metadata }) => {
      // This code RUNS ON YOUR SERVER after upload

      // Return only JSON-serializable properties
      return {
        key: file.key,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedBy: metadata.userId,
        url: file.url,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
