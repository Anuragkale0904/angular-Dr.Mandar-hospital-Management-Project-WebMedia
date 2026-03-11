import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicineMasterComponent } from './medicine-master.component';



describe('MedicineMasterComponent', () => {
  let component: MedicineMasterComponent;
  let fixture: ComponentFixture<MedicineMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedicineMasterComponent]
    });
    fixture = TestBed.createComponent(MedicineMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
