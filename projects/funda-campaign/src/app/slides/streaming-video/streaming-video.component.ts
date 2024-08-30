import { Component ,ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'app-streaming-video',
  templateUrl: './streaming-video.component.html',
  styleUrl: './streaming-video.component.css'
})
export class StreamingVideoComponent {
  uploadedImage: string | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onImageUpload(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.uploadedImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  deleteImage(event: Event): void {
    event.stopPropagation(); 
    this.uploadedImage = null;
  }
}
