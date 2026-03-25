import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, DataService, routes } from 'src/app/core/core.index';
import { ToasterService } from 'src/app/core/core.index';
import { DataservicesService } from 'src/app/services/dataservices.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  public routes = routes;
  public show_password = true;

  form = new FormGroup({
    user_name: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }
  constructor(private data: DataService, private toast: ToasterService, private auth: AuthService, private router: Router, public url: DataservicesService) { }

  loginFormSubmit() {
    if (this.form.invalid) return;

    const payload = this.form.value;

    this.url.login(payload).subscribe({
      next: (res: any) => {
        console.log(res);

        if (res.status === true) {

          sessionStorage.setItem('authenticated', 'true');
          localStorage.setItem('currentUser', JSON.stringify(res.data));
          localStorage.setItem('userPermissions', JSON.stringify(res.data.rides || []));
          

          localStorage.setItem('userBranches', JSON.stringify(res.data.branch || []));
          
          this.data.loadFilteredSidebar(); // 🔥 IMPORTANT
          this.router.navigate(['/dashboard']);
        }
        else {
          alert(res.message || 'Invalid credentials');
        }
      },
      error: () => {
        alert('Login failed. Check server.');
      }
    });
  }

}
