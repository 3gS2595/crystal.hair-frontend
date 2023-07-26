import { S3, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3({
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  endpoint: 'https://nyc3.digitaloceanspaces.com',
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'DO00YNYF8PRXBV6YDJEY',
    secretAccessKey: 'kG31IulZpvBIXEkBuLxskyey7RE7e0VO/07aHooA4I8'
  }
})

// enerates the URL.
export const run = async (path) => {
  try {
    const url = await getSignedUrl(s3Client, new GetObjectCommand({ Bucket: 'crystal-hair', Key: path }), { expiresIn: 15 * 60 }) // Adjustable expiration.
    console.log('URL:', url)
    return url
  } catch (err) {
    console.log('Error', err)
  }
}
