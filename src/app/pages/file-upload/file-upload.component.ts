import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {

  fileURL: any;
  imgURL: any;

  @Output() fileUrlEmitter = new EventEmitter<string>();
  @Output() imgUrlEmitter  = new EventEmitter<string>();


  //Main task
  task: AngularFireUploadTask;

  //Progress monitoring
  percentage: Observable<number>;

  snapshot: Observable<any>;

  //Download URL
  downloadURL: Observable<string>;

  //State for dropzone CSS toggling
  isHovering: boolean;

  constructor(private storage: AngularFireStorage) { }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  startUpload(event: FileList) {
    //The file object
    const file = event.item(0)

    //Client-side Validation example
    // if (file.type.split('/')[0] !== 'audio' || 'image') {
    //   console.error('No hay soporte en ese tipo de archivo :(')
    //   return;
    // }

    // The storage path
    const path = `test/${new Date().getTime()}_${file.name}`;

    const ref = this.storage.ref(path);

    // Totally opcional metadata
    const customMetadata = { app: 'My AngularFire-powered PWA!' };

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata })

    //progress monitoring
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges()

    //The file's download URL
    this.task.snapshotChanges().pipe(finalize(() => {
    this.downloadURL = ref.getDownloadURL();
    this.downloadURL.subscribe(url => {
        this.fileURL = url;
        this.fileUrlEmitter.emit(url);
        console.log("URL ES: " + url );
      });
    })).subscribe();

    this.task.snapshotChanges().pipe(finalize(() => {
      this.downloadURL = ref.getDownloadURL();
      this.downloadURL.subscribe(imgUrl => {
          this.imgURL = imgUrl;
          this.imgUrlEmitter.emit(imgUrl);
          console.log("URL ES: " + imgUrl );
        });
      })).subscribe();

  }



  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

}
