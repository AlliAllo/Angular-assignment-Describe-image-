import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, inject } from '@angular/core';

@Component({
  selector: 'app-image-loader',
  templateUrl: './image-loader.component.html',
  styleUrls: ['./image-loader.component.scss']
})

export class ImageLoaderComponent {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  protected typingInterval: any = null;
  protected selectedFile: File | null = null;
  protected description = '';
  protected displayedDescription = '';
  protected loading = false;
  protected error = '';
  protected selectedImageUrl: string | null = null;

  protected resetText() { // used to avoid some code duplication
    this.description = '';
    this.displayedDescription = '';
    this.error = '';
  }

  protected onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
    this.selectedImageUrl = this.selectedFile ? URL.createObjectURL(this.selectedFile) : null;

    if (this.typingInterval) clearInterval(this.typingInterval);

    this.resetText();
  }

  protected  describeImage() {
    if (!this.selectedFile) return;

    this.loading = true;
    this.resetText();

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.http.post<{ description: string }>('/describe', formData).subscribe({
      next: (res) => {
        this.description = res.description;
        this.loading = false;
        this.typeWriterEffect();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.error || 'Failed to describe image.';        
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  typeWriterEffect(speed: number = 16) { // lower value = faster typing 
    let i = 0;
    this.displayedDescription = '';
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }

    this.typingInterval = setInterval(() => {
      if (i < this.description.length) {
        this.displayedDescription += this.description[i];
        i++;
        this.cdr.detectChanges(); // Update template
      } else {
        clearInterval(this.typingInterval);
      }
    }, speed);
  }

}

export const ImageLoader = ImageLoaderComponent;