import {
  Directive,
  ElementRef,
  Renderer2,
  Inject
} from '@angular/core';
import { HttpService } from '../services/http.service';
import { PostMessageService } from '../services/post-message.service'
import { WINDOW } from '../window.module';

@Directive({
  selector: '.loading-container'
})
export class CompletionDivDirective {
  constructor(
    @Inject(WINDOW) private window: Window,
      private elementRef: ElementRef,
      private httpService: HttpService,
      private renderer: Renderer2,
      private postMessageService: PostMessageService,
  ) {
      let doneDivVisible = false;
      let doneDiv = document.createElement('div');
      this.renderer.addClass(doneDiv, 'doneLoading');
      this.httpService.openConnections().subscribe(openConnections => {
          if (openConnections === 0 && doneDivVisible === false) {
            this.renderer.appendChild(this.elementRef.nativeElement, doneDiv);
            doneDivVisible = true;
            this.postMessageService.send(window.top, 'doneLoading');
          } else if (doneDivVisible === true) {
            this.renderer.removeChild(this.elementRef.nativeElement, doneDiv);
            doneDivVisible = false;
          }
      });
  }
}
