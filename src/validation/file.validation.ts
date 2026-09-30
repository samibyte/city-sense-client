export const MAX_FILE_SIZE_MB = 5;

export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const MAX_ATTACHMENT_FILES = 5;

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const ACCEPTED_DOCUMENT_TYPES = ["application/pdf"];

export function isAcceptedFileType(file: File) {
  return (
    ACCEPTED_IMAGE_TYPES.includes(file.type) ||
    ACCEPTED_DOCUMENT_TYPES.includes(file.type)
  );
}

export function isAcceptedFileSize(file: File) {
  return file.size <= MAX_FILE_SIZE_BYTES;
}
