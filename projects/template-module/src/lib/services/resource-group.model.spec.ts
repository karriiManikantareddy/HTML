import { TestBed } from '@angular/core/testing'
import { tap } from 'rxjs/operators';
import { ResourceGroup } from './resource-group.model';

describe('Resource Monitor Service', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: []
    }).compileComponents();
  });

  afterEach(() => {
  });

  function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  it('sends nothing on create', async () => {
    let currentlyPending = null;
    let group = new ResourceGroup();
    group.resourcesInUse().pipe( tap( i => { currentlyPending = i }) ).subscribe();
    await delay(1);
    expect(currentlyPending).toBeNull();
  })

  it('one id can only be opened once', async () => {
    let currentlyPending = null;
    let group = new ResourceGroup();
    group.resourcesInUse().pipe( tap( i => { currentlyPending = i }) ).subscribe();
    group.create(5);
    await delay(1);
    expect(currentlyPending).toBe(1);
    group.create(5);
    await delay(1);
    expect(currentlyPending).toBe(1);
  })

  it('re-closing does nothing', async () => {
    let currentlyPending = null;
    let group = new ResourceGroup();
    group.resourcesInUse().pipe( tap( i => { currentlyPending = i }) ).subscribe();
    group.create(5);
    group.finalize(5);
    await delay(1);
    expect(currentlyPending).toBe(0);
    group.finalize(5);
    await delay(1);
    expect(currentlyPending).toBe(0);
  })

  it('groups are independent', async () => {
    let currentlyPending1 = null;
    let group1 = new ResourceGroup();
    group1.resourcesInUse().pipe( tap( i => { currentlyPending1 = i }) ).subscribe();
    let group2 = new ResourceGroup();
    let currentlyPending2 = null;
    group2.resourcesInUse().pipe( tap( i => { currentlyPending2 = i }) ).subscribe();
    group1.create(5);
    await delay(1);
    expect(currentlyPending1).toBe(1);
    expect(currentlyPending2).toBeNull();
  })

  it('finalize first implies creation', async () => {
    let currentlyPending = null;
    let group = new ResourceGroup();
    group.resourcesInUse().pipe( tap( i => { currentlyPending = i }) ).subscribe();
    group.finalize(5);
    await delay(1);
    expect(currentlyPending).toBe(0);
    group.create(5);
    await delay(1);
    expect(currentlyPending).toBe(0);
  })

  it('handles id 0', async () => {
    let currentlyPending = null;
    let group = new ResourceGroup();
    group.resourcesInUse().pipe( tap( i => { currentlyPending = i }) ).subscribe();
    group.create(0);
    await delay(1);
    expect(currentlyPending).toBe(1);
    group.finalize(0);
    await delay(1);
    expect(currentlyPending).toBe(0);
  })

  it('handles late subsribers', async () => {
    let group = new ResourceGroup();
    group.create(0);
    group.finalize(0);
    await delay(1);
    group.resourcesInUse().pipe( tap( i => { expect(i).toBe(0); }) ).subscribe();
  })

})
