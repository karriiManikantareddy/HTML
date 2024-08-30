import { Observable, Subject} from 'rxjs'
import { startWith, tap } from 'rxjs/operators'

export class ResourceGroup {
  private done = new Set();
  private inProgress = new Set();
  private hadEvents = false;
  private nrOfPendingReqSubject = new Subject<number>();

  public resourcesInUse(): Observable<number> {
    if (this.hadEvents) {
      return this.nrOfPendingReqSubject.pipe(
        startWith(this.inProgress.size)
      );
    } else {
      return this.nrOfPendingReqSubject;
    }
  }

  public create(id: number): void {
    this.hadEvents = true;
    if (!this.done.has(id) && !this.inProgress.has(id) ) {
      this.inProgress.add(id);
      this.sendNext();
    }
  }

  public finalize(id: number): void {
    this.hadEvents = true;
    if (!this.done.has(id)) {
      this.done.add(id);
      this.inProgress.delete(id);
      this.sendNext();
    }
  }

  private sendNext(): void {
    this.nrOfPendingReqSubject.next(this.inProgress.size);
  }
}

