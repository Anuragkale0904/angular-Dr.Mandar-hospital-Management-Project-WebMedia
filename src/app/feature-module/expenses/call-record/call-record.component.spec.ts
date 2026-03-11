import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CallRecordComponent } from './call-record.component';


describe('CallRecordComponent', () => {
  let component: CallRecordComponent;
  let fixture: ComponentFixture<CallRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallRecordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
