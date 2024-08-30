import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TemplateServiceMock } from '../mocks/template.service.mock';
import { TemplateService } from './template.service';

import { HttpService } from './http.service';

describe('Data Service', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let httpService: HttpService;
  let templateServiceMock = new TemplateServiceMock();
  const url = 'fake_test_url';
  const params = 'fake_test_params' as any;
  const expectedRet = 'expectedRet';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: TemplateService, useValue: templateServiceMock },
        HttpClient
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    httpService = new HttpService(httpClient, 0, 4);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  function expectOk(URL = url) {
    httpService.getRequest(URL, params).subscribe((a) => { expect(a).toEqual(expectedRet), of(0) });
  }

  function fetchRequest(URL = url) {
    const req = httpMock.expectOne((req) => req.url.includes(URL));
    expect(req.request.method).toBe("GET");
    return req
  }

  function returnOk(URL = url) {
    fetchRequest(URL).flush(expectedRet);
  }

  function return404(URL = url) {
    fetchRequest(URL).flush('', { status: 404, statusText: "bad" });
  }

  it('cancelled requests do not leave lingering pending status', async () => {
    let currentlyPending = null;
    let pendSub = httpService.openConnections().subscribe( (a) => { currentlyPending = a} );
    let sub = httpService.getRequest(url, params).subscribe((a) => { fail(a), of(0) });
    sub.unsubscribe();
    await delay(1);
    expect(currentlyPending).toBe(0);
    fetchRequest();
    pendSub.unsubscribe();
  })

  it('returns bodies on 200', () => {
    expectOk();
    returnOk()
  })

  it('retries on 404', async () => {
    expectOk();
    return404();
    await delay(1);
    return404();
    await delay(1);
    returnOk();
  })

  it('retries on 404 pending', async () => {
    let currentlyPending = null;
    let pendSub = httpService.openConnections().subscribe( (a) => { currentlyPending = a} );
    httpService.getRequest(url, params).subscribe();
    return404();
    await delay(1);
    return404();
    await delay(1);
    returnOk();
    await delay(1);
    console.log(`in test ${currentlyPending}`)
    expect(currentlyPending).toBe(0);
    pendSub.unsubscribe();
  })

  it('gives up eventually', async () => {
    httpService.getRequest(url, params).subscribe((a) => { expect(a).toBeUndefined(), of(0) });
    return404();
    await delay(1);
    return404();
    await delay(1);
    return404();
    await delay(1);
    return404();
    await delay(1);
    return404();
  })

  it('retries are independent', async () => {
    let url2 = "url2";
    expectOk(url);
    const sub = httpService.getRequest(url2, params).subscribe();
    return404(url2);
    await delay(1);
    return404(url2);
    await delay(1);
    return404(url2);
    await delay(1);
    return404(url2);
    await delay(1);
    return404(url2);
    await delay(1);
    return404(url);
    await delay(1);
    returnOk(url);
    await delay(1);
    sub.unsubscribe();
  })

  it('waits between retries', async () => {
    httpService = new HttpService(httpClient, 10000, 5);
    httpService.getRequest(url, params).subscribe((a) => { fail(a), of(0) }, (error) => { fail(error) });
    return404();
    await delay(1000);
  })

  it('knows if things are pending', async () => {
    let currentlyPending = null;
    let pendSub = httpService.openConnections().subscribe( (a) => {currentlyPending = a} );
    httpService.getRequest(url, params).subscribe();
    await delay(1);
    expect(currentlyPending).toBe(1);
    returnOk();
    await delay(1);
    expect(currentlyPending).toBe(0);
    pendSub.unsubscribe();
  })

  it('knows if things are pending, even if there are multiple replies per request', async () => {
    let currentlyPending = null;
    let pendSub = httpService.openConnections().subscribe( (a) => {currentlyPending = a} );
    httpService.getRequest(url, params).subscribe();
    let req = fetchRequest();
    let a = new HttpResponse<null> ( { body: null, status: 102, statusText: "working" });
    expect(currentlyPending).toBe(1);
    req.event(a);
    await delay(1);
    expect(currentlyPending).toBe(1);
    req.flush(null, { status: 200, statusText: "derp" });
    await delay(1);
    expect(currentlyPending).toBe(0);
    pendSub.unsubscribe();
  })

  it('knows if things are pending, even if there is a getRequest without subscribe', async () => {
    let currentlyPending = null;
    let pendSub = httpService.openConnections().subscribe( (a) => { currentlyPending = a } );
    let getReqObs = httpService.getRequest(url, params);
    await delay(1);
    expect(currentlyPending).toBeNull();
    getReqObs.subscribe();
    await delay(1);
    expect(currentlyPending).toBe(1);
    returnOk();
    await delay(1);
    expect(currentlyPending).toBe(0);
    pendSub.unsubscribe();
  })

  it('handles request body START', async () => {
    httpService.getRequest(url, params).subscribe((a) => { expect(a).toBe('START'), of(0) });
    fetchRequest().flush('START');
  })

  it('knows if things are pending, even if there are errors', async () => {
    let currentlyPending = null;
    let url2 = "url2";
    let pendSub = httpService.openConnections().subscribe( (a) => {console.log(`GOT A ${a}`), currentlyPending = a} );
    httpService.getRequest(url, params).subscribe();
    httpService.getRequest(url2, params).subscribe();
    returnOk(url2);
    await delay(1);
    expect(currentlyPending).toBe(1);
    returnOk();
    await delay(1);
    console.log(`CU ${currentlyPending} ${currentlyPending === false}`);
    expect(currentlyPending).toBe(0);
    pendSub.unsubscribe();
  })

  it('handles late subscribers to hasPendingEvents' , async () => {
    let currentlyPending = null;
    httpService.getRequest(url, params).subscribe();
    returnOk();
    await delay(1);
    let pendSub = httpService.openConnections().subscribe( (a) => {console.log(`GOT A ${a}`), currentlyPending = a} );
    await delay(1);
    expect(currentlyPending).toBe(0);
    pendSub.unsubscribe();
  })

})
