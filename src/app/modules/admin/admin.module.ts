import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HttpHeaderInterceptor } from '../../http.interceptor';
import { ApiService } from '../../services/api.service';
import { TalukaService } from '../../services/taluka.service';
import { AdminRoutingModule } from './admin-routing.module';



@NgModule({

  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right', // Set the position to top-right
      timeOut: 5000, // Set the display time to 5 seconds
      closeButton: true, // Optionally add a close button
      progressBar: true, // Optionally add a progress bar
      toastClass: 'ngx-toastr custom-toast', // Apply custom toast class
      titleClass: 'custom-toast-title', // Apply custom title class
      messageClass: 'custom-toast-message' // Apply custom message class
    })

  ],
  providers: [
    ApiService,
    TalukaService,
    ToastrService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpHeaderInterceptor,
      multi: true
    }
  ],
})
export class AdminModule { }
