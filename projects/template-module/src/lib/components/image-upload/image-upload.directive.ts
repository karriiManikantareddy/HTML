import {Directive, HostListener, HostBinding, EventEmitter, Output, Input} from '@angular/core'

@Directive({
  selector: '[imageUpload]'
})
export class ImageUploadDirective {
  @Output() filesChangeEmiter = new EventEmitter()
  @Output() filesInvalidEmiter = new EventEmitter()
  @HostBinding('style.background') background = 'rgba(1, 1, 1, 0.1)'

  allowedExtensions = ['png', 'jpg']

  constructor() {}

  @HostListener('dragover', ['$event']) public onDragOver(evt: DragEvent) {
    evt.preventDefault()
    evt.stopPropagation()
    this.background = '#999'
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt: DragEvent) {
    evt.preventDefault()
    evt.stopPropagation()
    this.background = 'rgba(1, 1, 1, 0.1)'
  }

  @HostListener('drop', ['$event']) public onDrop(evt: DragEvent) {
    evt.preventDefault()
    evt.stopPropagation()
    this.background = 'rgba(1, 1, 1, 0.1)'
    const files = evt.dataTransfer.files
    const valid_files: File[] = []
    const invalid_files: File[] = []
    if (files.length > 0) {
      Array.from(files).forEach((file: File) => {
        const ext = file.name.split('.').last().toLowerCase()
        if (this.allowedExtensions.lastIndexOf(ext) != -1) {
          valid_files.push(file)
        } else {
          invalid_files.push(file)
        }
      })
      this.filesChangeEmiter.emit(valid_files)
      this.filesInvalidEmiter.emit(invalid_files)
    }
  }
}
