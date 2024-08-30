import { fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { TemplateState } from './template.state';
import { PostMessageService, TemplateService } from 'projects/template-module/src/public_api';
import { Slide } from './services/template.service';

describe('TemplateState', () => {
  let service: TemplateState;
  let postMessageService = jasmine.createSpyObj<PostMessageService>('PostMessageService', ['send', 'addListener']);;
  let templatesService = jasmine.createSpyObj<TemplateService>('TemplateService', [
    'templateUrl',
    'getUniqueSlides',
    'getExportState',
  ]);

  const windowMock = {
    location: {
      search: '?context=cool',
    },
  } as Window;

  const windowMockExport = {
    location: {
      search: '?export_id=123',
    },
  } as Window;

  beforeEach(() => {
    service = new TemplateState(windowMock, postMessageService, templatesService)
  });

  afterEach(() => {
    service?.slides?.unsubscribe();

    postMessageService.send.calls.reset();
    postMessageService.addListener.calls.reset();
    templatesService.getExportState.calls.reset();
    templatesService.getUniqueSlides.calls.reset();
  });

  it('should subscribe to updateSlide and window-resize when initialized', () => {
    templatesService.getExportState.and.returnValue(of({ slides: [] }))

    expect(postMessageService.addListener.calls.count()).toBe(2)

    const firstCall = postMessageService.addListener.calls.argsFor(0)
    expect(firstCall[0]).toEqual('updateSlide')
    expect(typeof firstCall[1]).toEqual('function')

    const secondCall = postMessageService.addListener.calls.argsFor(1)
    expect(secondCall[0]).toEqual('window-resized')
    expect(typeof secondCall[1]).toEqual('function')
  })

  describe('when there are no slides in dom', () => {
    describe('when in preview mode', () => {
      it('should emit an empty array of slides twice when initialized and slideAdded is called', fakeAsync(() => {
        templatesService.getExportState.and.returnValue(of({ slides: [] }))
        templatesService.getUniqueSlides.and.returnValue([])

        let emits = 0
        const sub = service.slides.subscribe(slides => {
          expect(slides).toEqual([])
          if (emits === 1) {
            expect(postMessageService.send.calls.count()).toEqual(1)
            const [, ...argsForCall0] = postMessageService.send.calls.argsFor(0)
            expect(argsForCall0).toEqual(['slidesUpdated', { slides: [] }])
            sub.unsubscribe()
          } else {
            emits += 1
          }
        });

        service.slideAdded();
        tick(1000);
      }));

      describe('when state is updated from preview module', () => {
        it('should emit an empty array of slides when initialized slidesUpdated is called', fakeAsync(() => {
          templatesService.getExportState.and.returnValue(of({ slides: [] }))
          templatesService.getUniqueSlides.and.returnValue([])
          const slideUpdated = postMessageService.addListener.calls.argsFor(0)[1]

          let emits = 0
          const sub = service.slides.subscribe(slides => {
            expect(slides).toEqual([])
            if (emits === 1) {
              expect(postMessageService.send.calls.count()).toEqual(1)
              const [, ...argsForCall0] = postMessageService.send.calls.argsFor(0)
              expect(argsForCall0).toEqual(['slidesUpdated', { slides: [] }])
              sub.unsubscribe()
            } else {
              emits += 1
            }
          })

          slideUpdated({ name: 'Overview', enabled: false })
          tick(1000);
        }));
      })
    })

    describe('when in export mode', () => {
      beforeEach(() => {
        templatesService.getExportState.and.returnValue(of([]))
        service = new TemplateState(windowMockExport, postMessageService, templatesService)
      });
      describe('when exportState are empty', () => {
        it('should emit an empty array of slides', fakeAsync(() => {
          service.slides.subscribe(slides => {
            expect(slides).toEqual([])
            expect(postMessageService.send.calls.count()).toEqual(1)
            const [, ...argsForCall0] = postMessageService.send.calls.argsFor(0)
            expect(argsForCall0).toEqual(['slidesUpdated', { slides: [] }])
          })

        }));
      })

      describe("when exportState aren't empty", () => {
        it('should emit an empty array of slides', fakeAsync(() => {
          const exportState = {
            slides: [
              { name: 'Overview', enabled: false },
              {
                name: 'LineItems',
                enabled: true,
                toggles: [{ name: 'viewability', enabled: true }],
              },
            ],
          }
          templatesService.getExportState.and.returnValue(of(exportState))
          service.slides.subscribe(slides => {
            expect(slides).toEqual([])
            expect(postMessageService.send.calls.count()).toEqual(1)
            const [, ...argsForCall0] = postMessageService.send.calls.argsFor(0)
            expect(argsForCall0).toEqual(['slidesUpdated', { slides: [] }])
          })
        }));
      })
    })
  })

  describe('when there are slides in dom', () => {
    const initialSlides: Slide[] = [
      { name: 'Overview', enabled: false, toggles: [] },
      { name: 'LineItems', enabled: true, toggles: [{ name: 'viewability', enabled: true }] },
    ]
    describe('when in preview mode', () => {
      let slideUpdated;
      beforeEach(() => {
        slideUpdated = postMessageService.addListener.calls.argsFor(0)[1]
      });

      it('should emit first empty array and then the initial array of slides when slideAdded is called', fakeAsync(() => {
        templatesService.getUniqueSlides.and.returnValue(initialSlides)
        templatesService.getExportState.and.returnValue(of({ slides: [] }))

        let emits = 0
        const sub = service.slides.subscribe(slides => {
          if (emits === 1) {
            expect(slides).toEqual(initialSlides)
            expect(postMessageService.send.calls.count()).toEqual(1) /* will fail due to getExportState being called even when not in export state */
            const [, ...argsForCall0] = postMessageService.send.calls.argsFor(0)
            expect(argsForCall0).toEqual(['slidesUpdated', { slides: initialSlides }])
            sub.unsubscribe()
          } else {
            expect(slides).toEqual([])
            emits += 1
          }
        })
        service.slideAdded()
        tick(1000);
      }));

      describe('when state is updated from preview module', () => {
        let slidesWithChanges: Slide[];
        let newInitialSlides: Slide[];
        beforeEach(() => {
          slidesWithChanges = [...initialSlides]
          newInitialSlides = [...initialSlides]
          templatesService.getUniqueSlides.and.returnValue(initialSlides)
        })

        it('should emit the initial array of slides when slideUpdated is called with a change that already are in the slide', fakeAsync(() => {
          let emits = 0
          const sub = service.slides.subscribe(slides => {
            if (emits === 1) {
              expect(slides).toEqual(slidesWithChanges)
              expect(postMessageService.send.calls.count()).toEqual(1)
              const [, ...argsForCall0] = postMessageService.send.calls.argsFor(0)
              expect(argsForCall0).toEqual(['slidesUpdated', { slides: slidesWithChanges }])
              sub.unsubscribe()
            } else {
              emits += 1
            }
          })

          service.slideAdded()
          tick(1000);

          slideUpdated({ name: 'Overview', enabled: false, toggles: [] })
        }));

        it('should emit updated slides when slideUpdated is called with a change', fakeAsync(() => {
          const change = { name: 'Overview', enabled: false, toggles: [] }
          slidesWithChanges = slidesWithChanges.map(slide => {
            if (slide.name === 'Overview') {
              return Object.add(slide, change) as Slide
            }
            return slide
          })
          let emits = 0
          const sub = service.slides.subscribe(slides => {
            if (emits === 1) {
              expect(slides).toEqual(slidesWithChanges)
              expect(postMessageService.send.calls.count()).toEqual(1)
              const [, ...argsForCall0] = postMessageService.send.calls.argsFor(0)
              expect(argsForCall0).toEqual(['slidesUpdated', { slides: slidesWithChanges }])
              sub.unsubscribe()
            }
            emits += 1
          })

          service.slideAdded();
          tick(1000);
          slideUpdated(change)
        }));

        it('should emit unchanged slides when slideUpdated is called with a change that belong to slide not in the state yet', fakeAsync(() => {
          const change = { name: 'Creatives', enabled: true, toggles: [] }

          let emits = 0
          const sub = service.slides.subscribe(slides => {
            if (emits === 1) {
              expect(slides).toEqual(slidesWithChanges)
              expect(postMessageService.send.calls.count()).toEqual(1)
              const [, ...argsForCall0] = postMessageService.send.calls.argsFor(0)
              expect(argsForCall0).toEqual(['slidesUpdated', { slides: slidesWithChanges }])
              sub.unsubscribe()
            }
            emits += 1
          })

          service.slideAdded();
          tick(1000);
          slideUpdated(change)
        }));

      })

      describe('when a slides have two toggles which are enabled by default', () => {
        const initialSlides: Slide[] = [
          { name: 'Overview', enabled: false, toggles: [] },
          { name: 'LineItems', enabled: true, toggles: [{ name: 'viewability', enabled: true }] },
          {
            name: 'Regions',
            enabled: true,
            toggles: [
              { name: 'EU', enabled: true },
              { name: 'US', enabled: true },
            ],
          },
        ]
        const boilerplate = () => {
          templatesService.getUniqueSlides.and.returnValue(initialSlides)
          service.slideAdded()
          const slideUpdated = postMessageService.addListener.calls.argsFor(0)[1]
          return { postMessageService, window, templatesService, service, slideUpdated }
        }

        describe('when the slide with toggles is saved with a toggle missing', () => {
          it("should emit the slide with default values", fakeAsync(() => {
            const { postMessageService, service, slideUpdated } = boilerplate()
            const expectedSlides = initialSlides
            const newRegionSlide = {
              name: 'Regions',
              enabled: true,
              toggles: [
                { name: 'EU', enabled: true },
              ],
            }

            slideUpdated(newRegionSlide)
            let emits = 0
            const sub = service.slides.subscribe(slides => {
              if (emits === 1) {
                expect(slides).toEqual(expectedSlides)
                const [, ...argsForMostRecentCall] = postMessageService.send.calls.mostRecent().args
                expect(argsForMostRecentCall).toEqual(['slidesUpdated', { slides: expectedSlides }])
                sub.unsubscribe()
              }
              emits += 1
            })

            tick(1000);
          }));

          describe('when the remaining toggle is saved with a change', () => {
            it("should emit the slide with two toggles but the changed toggle updated", fakeAsync(() => {
              const { postMessageService, service, slideUpdated } = boilerplate()
              const newRegionSlide = {
                name: 'Regions',
                enabled: true,
                toggles: [
                  { name: 'EU', enabled: false },
                ],
              }
              const expectedSlides = initialSlides.map(slide => {
                if (slide.name === 'Regions') {
                  return {
                    name: 'Regions',
                    enabled: true,
                    toggles: [
                      { name: 'EU', enabled: false },
                      { name: 'US', enabled: true },
                    ],
                  }
                }
                return slide
              })

              slideUpdated(newRegionSlide)
              let emits = 0
              const sub = service.slides.subscribe(slides => {
                if (emits === 1) {
                  expect(slides).toEqual(expectedSlides)
                  const [, ...argsForMostRecentCall] = postMessageService.send.calls.mostRecent().args
                  expect(argsForMostRecentCall).toEqual(['slidesUpdated', { slides: expectedSlides }])
                  sub.unsubscribe()
                }
                emits += 1
              })
              tick(1000);
            }));
          })
        })

        describe('when the slide is saved with a toggle that dont exists in the template', () => {
          it("should emit the slide with default values", fakeAsync(() => {
            const { postMessageService, service, slideUpdated } = boilerplate()
            const expectedSlides = initialSlides
            const newRegionSlide = {
              name: 'Regions',
              enabled: true,
              toggles: [
                { name: 'EU', enabled: true },
                { name: 'US', enabled: true },
                { name: 'Asia', enabled: true },
              ],
            }

            slideUpdated(newRegionSlide)
            let emits = 0
            const sub = service.slides.subscribe(slides => {
              if (emits === 1) {
                expect(slides).toEqual(expectedSlides)
                const [, ...argsForMostRecentCall] = postMessageService.send.calls.mostRecent().args
                expect(argsForMostRecentCall).toEqual(['slidesUpdated', { slides: expectedSlides }])
                sub.unsubscribe()
              }
              emits += 1
            })
            tick(1000);
          }));

          describe('when the remaining toggle is saved with a change', () => {
            it("should emit the slide with two toggles but the changed toggle updated", fakeAsync(() => {
              const { postMessageService, service, slideUpdated } = boilerplate()
              const newRegionSlide = {
                name: 'Regions',
                enabled: true,
                toggles: [
                  { name: 'EU', enabled: false },
                ],
              }
              const expectedSlides = initialSlides.map(slide => {
                if (slide.name === 'Regions') {
                  return {
                    name: 'Regions',
                    enabled: true,
                    toggles: [
                      { name: 'EU', enabled: false },
                      { name: 'US', enabled: true },
                    ],
                  }
                }
                return slide
              })

              slideUpdated(newRegionSlide)
              let emits = 0
              const sub = service.slides.subscribe(slides => {
                if (emits === 1) {
                  expect(slides).toEqual(expectedSlides)
                  const [, ...argsForMostRecentCall] = postMessageService.send.calls.mostRecent().args
                  expect(argsForMostRecentCall).toEqual(['slidesUpdated', { slides: expectedSlides }])
                  sub.unsubscribe()
                }
                emits += 1
              })
              tick(1000);
            }));
          })

          describe('when the extra toggle is rendered late and is saved with non-default values', () => {
            it("should emit the slide with the extra toggle and with the saved values ", fakeAsync(() => {
              const { postMessageService, service, slideUpdated, templatesService } = boilerplate()
              const newUniqueSlides = initialSlides.map(slide => {
                if (slide.name === 'Regions') {
                  return {
                    name: 'Regions',
                    enabled: true,
                    toggles: [
                      { name: 'EU', enabled: true },
                      { name: 'US', enabled: true },
                      { name: 'Asia', enabled: false },
                    ],
                  }
                }
                return slide
              })
              const savedRegionSlide = {
                name: 'Regions',
                enabled: true,
                toggles: [
                  { name: 'EU', enabled: false },
                  { name: 'US', enabled: true },
                  { name: 'Asia', enabled: true },
                ],
              }
              const expectedSlides = initialSlides.map(slide => {
                if (slide.name === 'Regions') {
                  return {
                    name: 'Regions',
                    enabled: true,
                    toggles: [
                      { name: 'EU', enabled: false },
                      { name: 'US', enabled: true },
                      { name: 'Asia', enabled: true },
                    ],
                  }
                }
                return slide
              })

              slideUpdated(savedRegionSlide)
              let emits = 0
              const sub = service.slides.subscribe(slides => {
                if (emits === 1) {
                  templatesService.getUniqueSlides.and.returnValue(newUniqueSlides)
                  service.slideAdded()
                } else if (emits === 2) {
                  expect(slides).toEqual(expectedSlides)
                  const [, ...argsForMostRecentCall] = postMessageService.send.calls.mostRecent().args
                  expect(argsForMostRecentCall).toEqual(['slidesUpdated', { slides: expectedSlides }])
                  sub.unsubscribe()
                }
                emits += 1
              })
              tick(1000);
            }));
          })
        })
      })
    })

    describe('when in export mode', () => {
      describe('when exportState are empty', () => {
        it('should emit first empty array and then the initial array of slides', fakeAsync(() => {
          templatesService.getUniqueSlides.and.returnValue(initialSlides)
          templatesService.getExportState.and.returnValue(of({ slides: [] }))
          service = new TemplateState(windowMockExport, postMessageService, templatesService)

          let emits = 0
          const sub = service.slides.subscribe(slides => {
            if (emits === 1) {
              expect(slides).toEqual(initialSlides)
              sub.unsubscribe()
            } else {
              expect(slides).toEqual([])
            }
            emits += 1
          })
          service.slideAdded()
          tick(1000);
        }));

        describe('when getExportState is slow', () => {
          it('should send the initial array of slides twice', fakeAsync(() => {
            templatesService.getUniqueSlides.and.returnValue(initialSlides)
            templatesService.getExportState.and.returnValue(of({ slides: [] }).pipe(delay(400)))
            service = new TemplateState(windowMockExport, postMessageService, templatesService)

            let emits = 0
            const sub = service.slides.subscribe(slides => {
              if (emits === 2) {
                expect(slides).toEqual(initialSlides)
                sub.unsubscribe()
              } else if (emits === 1) {
                expect(slides).toEqual(initialSlides)
              } else {
                expect(slides).toEqual([])
              }
              emits += 1
            })
            service.slideAdded()
            tick(1000);
          }));
        })
      })

      describe("when exportState aren't empty", () => {
        const exportState = {
          slides: [
            { name: 'Overview', enabled: true, toggles: [] },
            {
              name: 'LineItems',
              enabled: true,
              toggles: [{ name: 'viewability', enabled: false }],
            },
          ],
        }

        const expectedSlidesAfterChanges = initialSlides.map(slide => {
          const ss = exportState.slides.find(s => s.name === slide.name)
          if (ss) {
            return Object.add(slide, ss) as Slide
          } else {
            return slide
          }
        })

        it('should emit first empty array and then the initial array of slides', fakeAsync(() => {
          templatesService.getUniqueSlides.and.returnValue(initialSlides)
          templatesService.getExportState.and.returnValue(of(exportState))
          service = new TemplateState(windowMockExport, postMessageService, templatesService)

          let emits = 0
          const sub = service.slides.subscribe(slides => {
            if (emits === 1) {
              expect(slides).toEqual(expectedSlidesAfterChanges)
              sub.unsubscribe()
            } else {
              expect(slides).toEqual([])
            }
            emits += 1
          })

          service.slideAdded()
          tick(1000);
        }));

        describe('when getExportState is slow', () => {
          it('should emit first empty array and then the initial array of slides', fakeAsync(() => {
            templatesService.getUniqueSlides.and.returnValue(initialSlides)
            templatesService.getExportState.and.returnValue(of(exportState).pipe(delay(400)))
            service = new TemplateState(windowMockExport, postMessageService, templatesService);

            let emits = 0
            const sub = service.slides.subscribe(slides => {
              if (emits === 2) {
                expect(slides).toEqual(expectedSlidesAfterChanges)
                sub.unsubscribe()
              } else if (emits === 1) {
                expect(slides).toEqual(initialSlides)
              } else {
                expect(slides).toEqual([])
              }
              emits += 1
            })
            service.slideAdded()
            tick(1000);
          }));
        })
      })
    })
  })
})
