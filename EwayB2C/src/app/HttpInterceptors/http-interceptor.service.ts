
import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as Mydatas from '../app-config.json';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
import { SharedService } from '../demo/service/shared.service';
import { AuthService } from '../demo/service/auth.service';
import { CustomLoadingService } from '../demo/shared/custom-loading.service';

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptorService implements HttpInterceptor {
  public AppConfig: any = (Mydatas as any).default;

  service_count = 0;
  totalRequests = 0;
  completedRequests = 0;
  submitted = false;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  public CommonApiUrl: any = this.AppConfig.CommonApiUrl;
  userType:any;
  loginSection:boolean = false;
  branchList:any[]=[];
  invalidIssuer = false;branchValue:any;
  public Proceed =false;

  constructor(
    public router: Router,private cookieService:CookieService,
    private loader: CustomLoadingService,
    public dialog: MatDialog,
    private sharedService: SharedService,
    private authService: AuthService,
    // private logincomponent:LoginComponent

  ) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if(!sessionStorage.getItem('loadingType')){console.log("Entered");this.loader.show();}
    else this.loader.hide();
    this.totalRequests++;
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log("error",this.router.url,req);
          if(this.router.url=='/login'){
           this.loginResponse(event.body,req)
          }
          else{
            this.openResponse(event.body,req)
          }

        }
        return event;
      }),
      finalize(() => {
        this.completedRequests++;
        if (this.completedRequests === this.totalRequests) {
          this.loader.hide();
          this.sharedService.clearTimeOut();
          this.completedRequests = 0;
          this.totalRequests = 0;
        }

      }),
      catchError((err) => {
        if ([401, 403].includes(err.status)) {
          // auto logout if 401 or 403 response returned from api
          this.authService.logout();
          //alert("logOut");
          let ulList=`<li class="list-group-item">
          <div style="color: darkgreen;">Field<span class="mx-2">:</span>LogOut Happened</div>
           <div style="color: red;">Message<span class="mx-2">:</span>From Another Device</div>
         </li>`
          Swal.fire({
            title: '<strong>Session Error</strong>',
            icon: 'info',
            html:
              `<ul class="list-group errorlist">
               ${ulList}
           </ul>`,
            //showCloseButton: true,
            //focusConfirm: false,
            showCancelButton:false,

           //confirmButtonColor: '#3085d6',
           cancelButtonColor: '#d33',
           //confirmButtonText: 'Proceed Login!',
           cancelButtonText: 'Cancel',
         }).then((result) => {
          if (result.isConfirmed) {
            //this.login(req?.body);
            sessionStorage.clear();
            this.cookieService.delete('XSRF-TOKEN',"/","domain name",true,"None")
            if(this.router.url!='/b2clogin') this.router.navigate(['/login']);
        }
      });

        }
        else if([500].includes(err.status)){
          let ulList=`<li class="list-group-item">
          <div style="color: primary;font-size:10px">Url:&nbsp;<b>${req.url}</b></div>
          <div style="color: red;font-size:12px;"><b>Internal Server Error</b></div>
         </li>`
          Swal.fire({
            title: '<strong>Error</strong>',
            icon: 'info',
            html:
              `<ul class="list-group errorlist">
               ${ulList}
              </ul>`,
                //showCloseButton: true,
                //focusConfirm: false,
                showCancelButton:false,

              //confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              //confirmButtonText: 'Proceed Login!',
              cancelButtonText: 'Okay!',
            })
        }
        else if([400].includes(err.status)){
          console.log("Request",req.url)
          let ulList=`<li class="list-group-item">
          <div style="color: primary;font-size:10px">Url:&nbsp;<b>${req.url}</b></div>
          <div style="color: red;font-size:12px;"><b>Bad Request Error</b></div>
         </li>`
          Swal.fire({
            title: '<strong>Error</strong>',
            icon: 'info',
            html:
              `<ul class="list-group errorlist">
               ${ulList}
              </ul>`,
                //showCloseButton: true,
                //focusConfirm: false,
                showCancelButton:false,

              //confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              //confirmButtonText: 'Proceed Login!',
              cancelButtonText: 'Okay!',
            })
        }
      else if (err instanceof HttpErrorResponse) {
          const errorList: any[] = err.error.ErrorMessage;
          if (errorList.length > 0) {

            this.openError(errorList);

          }

        }
        const error = err.error?.message || err.statusText;
        console.error(err);
        //return throwError(err.message);
        return throwError(() => error);

      }),
    );
  }

  loginResponse(res: any,req:any) {

    //  if (res?.ErrorMessage && res?.ErrorMessage.length > 0 || res?.Result?.ErrorMessage && res?.Result?.ErrorMessage.length > 0) {
    //   const errorList: any[] = res.ErrorMessage || res?.Result?.ErrorMessage;
    //   let ulList:any='';
    //    let entry:any[] =  errorList.filter(ele=>ele.Field=='SessionError')
    //    console.log("checked entry",entry);

    //    for (let index = 0; index < errorList.length; index++) {
       
    //      const element = errorList[index];
    //      alert(element?.Field)
    //       ulList +=`<li class="list-group-login-field">
    //      <div style="color: darkgreen;">Field<span class="mx-2">:</span>${element?.Field}</div>
    //       <div style="color: red;">Message<span class="mx-2">:</span>${element?.Message}</div>
    //     </li>`
    //    }
    //   if(entry.length==0){
    //      Swal.fire({
    //       title: '<strong>Form Validation</strong>',
    //       icon: 'info',
    //       html:
    //         `<ul class="list-group errorlist">
    //          ${ulList}
    //       </ul>`,
    //       showCloseButton: true,
    //       focusConfirm: false,
    //       confirmButtonText:
    //         '<i class="fa fa-thumbs-down"></i> Errors!',
    //       confirmButtonAriaLabel: 'Thumbs down, Errors!',
    //     })
    //   }
    //   else {
    //     console.log("entered multiiiiiiiiiiiiiiiiiiii");
    //     Swal.fire({
    //        title: '<strong>Session Error</strong>',
    //        icon: 'info',
    //        html:
    //          `<ul class="list-group errorlist">
    //           ${ulList}
    //       </ul>`,
    //        showCloseButton: true,
    //        focusConfirm: false,
    //        showCancelButton:true,

    //       confirmButtonColor: '#3085d6',
    //       cancelButtonColor: '#d33',
    //       confirmButtonText: 'Proceed Login!',
    //       cancelButtonText: 'Cancel',
    //     })
    //     .then((result) => {
    //       if (result.isConfirmed) {
          //  this.logincomponent.login(req?.body);
             // this.login(req?.body); 
            // this.router.navigate(['/branch']);
        }

    //     });

    //   }
    //  }

// }
onBranchProceed(){
  this.Proceed = true;
  if(this.branchValue!='' && this.branchValue!=undefined){
    let userDetails = JSON.parse(sessionStorage.getItem('Userdetails'));
    if(this.userType =='Issuer'){
      let branchData:any = this.branchList.find(ele=>ele.BranchCode == this.branchValue);
      userDetails.Result['BrokerBranchCode'] = null;
      userDetails.Result['BranchCode'] = branchData.BranchCode;
      userDetails.Result['CurrencyId'] = branchData?.CurrencyId;
      userDetails.Result['InsuranceId'] = branchData?.InsuranceId;
      sessionStorage.setItem('Userdetails', JSON.stringify(userDetails));
      this.router.navigate(['/product']);
    }
    else{

      let branchData:any = this.branchList.find(ele=>ele.BrokerBranchCode == this.branchValue);
      console.log("Branch Value",this.branchValue,branchData)
      userDetails.Result['BrokerBranchCode'] = branchData.BrokerBranchCode;
      userDetails.Result['BranchCode'] = branchData.BranchCode;
      userDetails.Result['CurrencyId'] = branchData?.CurrencyId;
      userDetails.Result['InsuranceId'] = branchData?.InsuranceId;
      sessionStorage.setItem('Userdetails', JSON.stringify(userDetails));
      this.router.navigate(['/product']);
    }

  }
}
// login(req:any)
// {
//   let ReqObj = req;
//   ReqObj['ReLoginKey'] = "Y";
//   const urlLink = `${this.CommonApiUrl}authentication/login`;
//   this.loginService.onPostMethodSync(urlLink,ReqObj).subscribe(
//     (data: any) => {
//       let res:any = data;
//       console.log(data);
//       if (data.Result) {
//         const Token = data?.Result?.Token;
//         this.authService.login(data);
//         this.authService.UserToken(Token);
//         sessionStorage.setItem('Userdetails', JSON.stringify(data));
//         sessionStorage.setItem('UserToken', Token);
//         sessionStorage.setItem('menuSection', 'navMenu');
//         this.userType = data.Result.UserType;
//         if(data.Result.UserType=='Issuer' || data.Result.UserType=='Broker'){
//           let branchList:any[] = data?.Result?.LoginBranchDetails;
//           if(branchList.length!=0 && branchList.length>1){
//             console.log("Entered Branch",branchList)
//             this.router.navigate(['/branch']);
//           }
//           else{
//             this.branchList = branchList;
//             if(this.userType == 'Issuer'){
//               this.branchValue = branchList[0].BranchCode;
//               this.onBranchProceed();
//             }
//             else{
//               this.branchValue = branchList[0].BrokerBranchCode;
//               this.onBranchProceed();
//             }

//           }
//         }
//       }
//       else{
//          if(res.ErrorMessage){
//            console.log("Error Iterate",data.ErrorMessage)
//         }
//       }
//     },

//     (err: any) => { console.log(err); },
//   );
// }




  openResponse(res: any,req:any) {
    console.log(res);
    //console.log(ErrorMessage);
    let loadingType = sessionStorage.getItem('loadingType');
    if (res?.ErrorMessage && res?.ErrorMessage.length > 0 && loadingType!='motorSearch') {
      const errorList: any[] = res.ErrorMessage || res?.Result?.ErrorMessage;
      console.log("ERRRRRRRR",errorList);
      let ulList:any='';

      for (let index = 0; index < errorList.length; index++) {
        const element = errorList[index];
         ulList +=`<li class="list-group-login-field">
         <div style="color: darkgreen;">Field<span class="mx-2">:</span>${element?.Field}</div>
         <div style="color: red;">Message<span class="mx-2">:</span>${element?.Message}</div>
       </li>`
       console.log('ERRRRRRRRRRR',element);

      }
      //sssss
      Swal.fire({
        title: '<strong>Form Validations</strong>',
        icon: 'info',
        html:
          `<ul class="list-group errorlist">
           ${ulList}
        </ul>`,
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText:
          '<i class="fa fa-thumbs-down"></i> Errors!',
        confirmButtonAriaLabel: 'Thumbs down, Errors!',
      })
    }
  }

  openError(res: any) {
    const errorList: any[] = res || [];

    if (errorList.length > 0) {
      console.log(errorList)
      let ulList:any='';
      for (let index = 0; index < errorList.length; index++) {
        const element = errorList[index];
        console.log('EEEEs',element)
         ulList +=`<li class="list-group-login-field">
         <div style="color: darkgreen;">Field<span class="mx-2">:</span>${element?.Field}</div>
         <div style="color: red;">Message<span class="mx-2">:</span>${element?.Message}</div>
       </li>`

      }
      Swal.fire({
        title: '<strong>Error</strong>',
        icon: 'info',
        html:
          `<ul class="list-group errorlist">
           ${ulList}
        </ul>`,
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText:
          '<i class="fa fa-thumbs-down"></i> Errors!',
        confirmButtonAriaLabel: 'Thumbs down, Errors!',
      })

    }
  }
}
