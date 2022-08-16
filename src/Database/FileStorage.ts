import { Connection } from "mongoose";
import { GridFSBucket } from "mongodb";

class FileStorage {
  private audioStorage: GridFSBucket | null = null;

  private imageStorage: GridFSBucket | null = null;

  private videoStorage: GridFSBucket | null = null;

  /**
   * Upload/Download audio files to your MongoDB
   */
  public get getAudioStorage() {
    return this.audioStorage;
  }

  /**
   * Upload/Download audio files to your MongoDB
   */
  public get getImageStorage() {
    return this.imageStorage;
  }

  /**
   * Upload/Download video files to your MongoDB
   */
  public get getVideoStorage() {
    return this.videoStorage;
  }

  /**
   * Connect the filestorage to the MongoDB current connection
   * @param connection
   */
  public Connect(connection: Connection) {
    this.audioStorage = new GridFSBucket(connection.db, {
      bucketName: "AudioStorage",
    });
    this.imageStorage = new GridFSBucket(connection.db, {
      bucketName: "ImageStorage",
    });
    this.videoStorage = new GridFSBucket(connection.db, {
      bucketName: "VideoStorage",
    });
  }
}

export default new FileStorage();
