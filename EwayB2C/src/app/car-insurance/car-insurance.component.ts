import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../Auth/auth.service';
import { SharedService } from '../shared/shared.service';
import * as Mydatas from '../app-config.json';
import { Expression } from '@angular/compiler';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-car-insurance',
  templateUrl: './car-insurance.component.html',
  styleUrls: ['./car-insurance.component.scss']
})
export class CarInsuranceComponent implements OnInit {
  vehicleForm!: FormGroup; 
  customerForm!: FormGroup; fuelTypeList:any[]=[];
  showCustomerForm = false;makeList:any[]=[];modelList:any[]=[];
  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  public CommonApiUrl: any = this.AppConfig.CommonApiUrl;
  public motorApiUrl: any = this.AppConfig.MotorApiUrl;
  encryptedValue:any=null;yearList:any[]=[];
  branchselection: boolean=false;bodyTypeValue:any=null;
  branchList: any[]=[];bodytypeList:any[]=[];
  branchValue: any=null;typeList:any[]=[];
  insuranceId: any=null;occupationList:any[]=[];
  branchCode: any=null;userdetails:any={};
  motorUsageList: any[]=[];vehicleDetailsList:any[]=[];
  claimTypeList: any[]=[];motorTypeList: any[]=[];
  mainBodyTypeList: any[]=[];
  editSection: any;motordetails: any;typeValue: any;customerReferenceNo: any;
  quoteRefNo: any;policyStartDate: any=null;policyEndDate: any=null;mobileCodeList: any[]=[];
  individualCalcIndex: number;
  bodyType: any;
  constructor(private fb: FormBuilder , private _formBuilder: FormBuilder,
    private authService: AuthService,private datePipe:DatePipe,
    private router: Router,private shared: SharedService) {}
    ngOnInit(): void {
      // Initialize Vehicle Form
      this.vehicleForm = this.fb.group({
        motorUsage: [null, Validators.required],
        bodyType: [null, Validators.required],
        make: [null, Validators.required],
        model: [null],
        modelDesc: [null],
        manufactureYear: [null, [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
        engineCapacity: [null, [Validators.required, Validators.min(1)]],
        fuelType: [null, Validators.required],
        license: [null, Validators.required],
        drivingexp: [null, Validators.required],
        claimType: [null, Validators.required],
        vehicleSumInsured: [null, Validators.required],
        renewYN: ['N', Validators.required],
        insuranceType: ['103', Validators.required]
      });
  
      // Initialize Customer Form
      this.customerForm = this.fb.group({
        customerName: ['', Validators.required],
        mobileNo: ['', [Validators.required]],
        mobileCode: ['', [Validators.required]],
        dob: ['', Validators.required],
        occupation: ['', Validators.required],
      });
      this.encryptedValue='BIxEDbyzljyRQioO+7ARQqLPPKu+WfA4udDCuES1WxsdFNDHLT6r7YP540AG1KmAQNWgrJuNuFGsOcuW6fb7wSBLK3luky6H576Ecw1t8syqtnp5ItYS0h+3UK7FRNYugQljNKJF2pDsu4O4M7mAIxmgrtg15T7ShalOk7mhoznnIbl5WSM+lnONMWpyqPqNfmF8ZEfSm3gagf0a+eZBDDlCiwzw0Lpqw7jSLMH8YyzgmUzu868ix2X9oRLgN2vUJzsd2+KWPAU5wqbwC/eVpYmvEB0NHJZxWqX2ez4V9MaCkz1oCxqssGYUIw2efm+j';
        // this.encryptedValue='BIxEDbyzljwo1iea31wcJerd+8CHJtGiK5515u9KfTP3UpNpdbuVJD7kmQUmEaWeRJNDJ3S3qqa0Q1q5ccWwzuXidDTUb7eLQNCy8IL3ccyG6R3g13uuQywgCHKF9HcJF+Eil0N7SiyZ6es9cjIdjaAY7ZXRltrNh3yQ/60HRNx8ewBg88yoRk1g1Kc+EDDbqrEFyr0ZGDlSGcqBV6Vf5RSGF2QQSLYFqu0+42rJBXLNXgmDO8hePPb5rcdma2bqACtal7sb02nmR0r3YBaKBd9CFr5fqMGvl9bQUMswIvE=';
         this.getDecryptData();
    }
  async getDecryptData(){
    let urlLink = `${this.CommonApiUrl}authentication/doauth`
    let ReqObj = {
        "e":this.encryptedValue
    };
    (await this.shared.onPostMethodUnAuthAsync(urlLink, ReqObj)).subscribe(
      (data: any) => {
        let res: any = data;
        console.log(data);
        console.log(data,"data");
        
        if (data.Result) {
          // this.errorSection = false;
          if(data.AdditionalInfo){
            let details = data.AdditionalInfo;
            console.log(details,"detailsdetails");
            
            if(details.QuoteNo!='null' && details.QuoteNo!=null){
                sessionStorage.setItem('quoteNo',details?.QuoteNo)
            }
            let custRefNo = details?.CustomerRefNo;
            if(custRefNo!='' && custRefNo!='null' && custRefNo!=null && custRefNo!=undefined){
              sessionStorage.setItem('customerReferenceNo',custRefNo);
            }
            let refNo = details?.RefNo;
            if(refNo!='' && refNo!='null' && refNo!=null && refNo!=undefined){
              sessionStorage.setItem('quoteReferenceNo',refNo);
            }
            let result = data.Result;
            let insuranceId = details?.InsuranceId;
            if(insuranceId!='' && insuranceId!='null' && insuranceId!=null && insuranceId!=undefined){
              result['InsuranceId'] = insuranceId;
            }
            let productId = details?.ProductId;
            if(productId!='' && productId!='null' && productId!=null && productId!=undefined){
              result['ProductId'] = productId;
            }
            let branchCode = details?.BranchCode;
            if(branchCode!='' && branchCode!='null' && branchCode!=null && branchCode!=undefined){
              result['BranchCode'] = branchCode;
            }
           const Token = data?.Result?.Token;
            this.authService.login(data);
            this.authService.UserToken(Token);
            sessionStorage.setItem('UserToken',Token);
            if(data?.Result?.LoginBranchDetails){
              if(data?.Result?.LoginBranchDetails.length!=0){
                data.Result['BranchCode'] = data?.Result?.LoginBranchDetails[0].BranchCode;
                data.Result['BrokerBranchCode'] = data?.Result?.LoginBranchDetails[0].BrokerBranchCode;
                data.Result['CurrencyId'] = data?.Result?.LoginBranchDetails[0].CurrencyId;
                this.insuranceId = details?.InsuranceId;
                this.branchCode = data.Result['BranchCode'];
                this.userdetails = data.Result;
                
              }
            }
            console.log("Final Setted Data",data)
            sessionStorage.setItem('Userdetails',JSON.stringify(data));
           this.getMotorUsageList();
           this.getFuelTypeList();
           this.getClaimTypeList();
           this.getInsuranceTypeList();
           this.getOccupationList();
           this.getMobileCodeList();
          this.yearList = this.getYearList();
          }
        }
        else if(data.ErrorMessage){
            if(data.ErrorMessage.length!=0){
              // this.errorSection = true;
              // this.errorList = data.ErrorMessage;
            }
        }
      },
      (err: any) => {
        alert("Error")
        // console.log(err);
      },
    );
}
  getYearList(){
    var d = new Date();
    var year = d.getFullYear();
    const currentYear = new Date().getFullYear()-20, years = [];
    while ( year >= currentYear ) {
      let yearEntry = year--
      years.push({"Code":String(yearEntry),'label':String(yearEntry),"value":String(yearEntry),"CodeDesc":String(yearEntry)});
    }   
    return years;
  }
  getClaimTypeList(){
    let ReqObj = {
      "InsuranceId": this.insuranceId
    }
    let urlLink = `${this.CommonApiUrl}dropdown/claimtype`;
    this.shared.onPostMethodSync(urlLink, ReqObj).subscribe(
      (data: any) => {
        if (data.Result) {
          let defaultObj = [{'Code':null,'CodeDesc':'---Select---'}];
          this.claimTypeList = defaultObj.concat(data.Result);
        }
      })
  }
  onBodyTypeChange(type){
    if(this.vehicleForm.controls['bodyType'].value!=null && this.vehicleForm.controls['bodyType'].value!=''){
      this.bodyType = this.mainBodyTypeList.find(ele=>ele.Code==this.vehicleForm.controls['bodyType'].value)?.BodyType
      if(type=='change' && this.insuranceId!='100020' && !this.editSection){this.vehicleForm.controls['make'].setValue(null);}
      if(this.vehicleForm.controls['bodyType'].value && this.insuranceId!='100020'){ this.getMakeList(); } 
      if(this.editSection && this.motorTypeList.length!=0) this.editSection = false;
    }
  }
  getMakeList(){
    let ReqObj = {
      "InsuranceId": this.insuranceId,
      "BranchCode": this.branchCode,
      "BodyId": this.vehicleForm.controls['bodyType'].value
    }
    let urlLink = `${this.CommonApiUrl}master/dropdown/motormake`;
    this.shared.onPostMethodSync(urlLink,ReqObj).subscribe(
      (data: any) => {
        console.log(data);
        if(data.Result){
          let defaultObj = [{'Code':null,'CodeDesc':'---Select---'}];
            this.makeList = defaultObj.concat(data.Result);
        }
      });
  }
  checkModelDropdownHide(){
    if((this.vehicleForm.controls['bodyType'].value=='1' || this.vehicleForm.controls['bodyType'].value=='2' || this.vehicleForm.controls['bodyType'].value=='3' || this.vehicleForm.controls['bodyType'].value=='' || this.vehicleForm.controls['bodyType'].value==null) && this.bodyType!='100'){  return false; }
    else{console.log(this.vehicleForm.controls['bodyType'].value); return true; }
  }
  checkModelFieldHide(){
    if(((this.vehicleForm.controls['bodyType'].value!='1' && this.vehicleForm.controls['bodyType'].value!='2' && this.vehicleForm.controls['bodyType'].value!='3' && this.vehicleForm.controls['bodyType'].value!='' && this.vehicleForm.controls['bodyType'].value!=null) || this.vehicleForm.controls['model'].value=='99999') || this.bodyType=='100'){  return false; }
    else{ return true; }
  }
  getInsuranceTypeList(){
    let ReqObj = {
      "ProductId": '5',
      "InsuranceId": this.insuranceId,
      "BranchCode": this.branchCode
    }
    let urlLink = `${this.ApiUrl1}master/dropdown/productsection`;
    this.shared.onPostMethodSync(urlLink,ReqObj).subscribe(
      (data: any) => {
        console.log(data);
        if(data.Result){
            this.typeList = data.Result;
        }
      });
  }
  getOccupationList(){
    let ReqObj = {
			"InsuranceId": this.insuranceId,
			"BranchCode": this.branchCode,
			"ProductId":'5',
		    "TitleType":null
		}
		let urlLink = `${this.CommonApiUrl}master/dropdown/occupation`;
		this.shared.onPostMethodSync(urlLink, ReqObj).subscribe(
			(data: any) => {
				if (data.Result) {
          let defaultObj = [{'Code':null,'CodeDesc':'---Select---'}];
					this.occupationList = defaultObj.concat(data.Result);
        }
      })
  }
  getMobileCodeList(){
    let ReqObj = { "InsuranceId": this.insuranceId }
    let urlLink = `${this.CommonApiUrl}dropdown/mobilecodes`;
    this.shared.onPostMethodSync(urlLink, ReqObj).subscribe(
      (data: any) => {
        console.log(data);
				if (data.Result) {
          let defaultObj = [{'Code':null,'CodeDesc':'---Select---'}];
					this.mobileCodeList = defaultObj.concat(data.Result);
        }
      })
  }
  getModelList(type){
    let ReqObj = {
      "InsuranceId": this.insuranceId,
      "BranchCode": this.branchCode,
      "BodyId": this.vehicleForm.controls['bodyType'].value,
      "MakeId": this.vehicleForm.controls['make'].value
    }
    let urlLink = `${this.CommonApiUrl}master/dropdown/motormakemodel`;
    this.shared.onPostMethodSync(urlLink,ReqObj).subscribe(
      (data: any) => {
        console.log(data);
        if(data.Result){
          let defaultObj = [{'Code':null,'CodeDesc':'---Select---'}];
            this.modelList = defaultObj.concat(data.Result);
            if(type=='change') this.vehicleForm.controls['model'].setValue(null)
        }
      });
  }
  

  onSubmitVehicle(): void {
    if (this.vehicleForm.valid) {
      console.log('Vehicle Form Submitted:', this.vehicleForm.value);
      this.showCustomerForm = true;  // Show the Customer Form after vehicle form submission
    }
  }

  onSubmitCustomer(): void {
    if (this.customerForm.valid) {
      
    }
  }
  /*Dropdown Api's */
  getMotorUsageList(){
    let ReqObj = {
      "InsuranceId": this.insuranceId,
      "BranchCode": this.branchCode
    }
    let urlLink = `${this.CommonApiUrl}api/dropdown/induvidual/vehicleusage`;
    this.shared.onPostMethodSync(urlLink,ReqObj).subscribe(
      (data: any) => {
        console.log(data);
        if(data.Result){
          let defaultObj = [{'Code':null,'CodeDesc':'---Select---'}];
            this.motorUsageList = defaultObj.concat(data.Result);
        }
      })
  }
  getFuelTypeList(){
    let ReqObj = {
      "InsuranceId": this.insuranceId,
      "BranchCode": this.branchCode
    }
    let urlLink = `${this.CommonApiUrl}dropdown/fueltype`;
    this.shared.onPostMethodSync(urlLink,ReqObj).subscribe(
      (data: any) => {
        console.log(data);
        if(data.Result){
          let defaultObj = [{'Code':null,'CodeDesc':'---Select---'}];
            this.fuelTypeList = defaultObj.concat(data.Result);
        }
      });
  }
  onChangeMotorUsage(type){
    if(this.vehicleForm.controls['motorUsage'].value!=null && this.vehicleForm.controls['motorUsage'].value!='' && this.vehicleForm.controls['motorUsage'].value!=undefined){
     let entry = this.motorUsageList.find(ele=>ele.CodeDesc==this.vehicleForm.controls['motorUsage'].value || ele.Code==this.vehicleForm.controls['motorUsage'].value);
     console.log("Filtered Obj",entry)
     if(entry){  
          let defaultObj = [{'label':'---Select---','value':'','Code':'','CodeDesc':'---Select---'}]; 
           let bodyTypeStatus = entry?.BodyType;
           if(this.insuranceId=='100027' || this.insuranceId=='100040' || this.insuranceId=='100002' || this.insuranceId=='100028' || this.insuranceId=='100018' || this.insuranceId=='100019' || this.insuranceId=='100020'){
              this.bodytypeList = this.motorTypeList.filter(ele=>ele.BodyType==bodyTypeStatus)
            }
           if(type=='change') this.bodyTypeValue = null;
         }
    }
  }
  getMotorTypeList(type,motorValue,vehicleUsage){
    if(this.insuranceId=='100027' || this.insuranceId=='100040' || this.insuranceId=='100002' || this.insuranceId=='100028' || this.insuranceId=='100018' || this.insuranceId=='100019' || this.insuranceId=='100020') this.typeValue = this.vehicleForm.controls['motorUsage'].value;
    let ReqObj = {
      "InsuranceId": this.insuranceId,
      "BranchCode": this.branchCode
    }
    let urlLink = `${this.CommonApiUrl}master/dropdown/induvidual/bodytype`;
    this.shared.onPostMethodSync(urlLink,ReqObj).subscribe(
      (data: any) => {
        if(data.Result){ 
            this.motorTypeList = data.Result;
            if(type=='direct' && !this.editSection){ this.bodyTypeValue = motorValue; this.vehicleForm.controls['bodyType'].setValue(motorValue);}
            else if(this.insuranceId!='100027' && this.insuranceId!='100040') this.bodyTypeValue = motorValue;
            if(this.motordetails && this.motorTypeList.length!=0 && this.bodyTypeValue==null){
              let value = this.motorTypeList.find(ele=>ele.Code == this.motordetails?.VehicleType || ele.CodeDesc == this.motordetails?.VehicleType);
              if(value){ this.bodyTypeValue = value.Code;}
            }
            if(this.motorTypeList.length!=0){
              let defaultObj = [{'label':'---Select---','value':'','Code':'','CodeDesc':'---Select---'}];
              for (let i = 0; i < this.motorTypeList.length; i++) {
                this.motorTypeList[i].label = this.motorTypeList[i]['CodeDesc'];
                this.motorTypeList[i].value = this.motorTypeList[i]['Code'];
                if (i == this.motorTypeList.length - 1) {
                  //if(this.motordetails && this.editSection) this.onBodyTypeChange('direct');
                  if(this.insuranceId=='100027' || this.insuranceId=='100040' || this.insuranceId=='100002' || this.insuranceId=='100028' || this.insuranceId=='100018' || this.insuranceId=='100019' || this.insuranceId=='100020' || this.insuranceId=='100004'){
                    if(this.motorTypeList.length!=0 && this.vehicleForm.controls['motorUsage'].value!=null && this.vehicleForm.controls['motorUsage'].value!='' && this.vehicleForm.controls['motorUsage'].value!=undefined){
                        let entry = this.motorUsageList.find(ele=>ele.CodeDesc==this.vehicleForm.controls['motorUsage'].value || ele.Code==this.vehicleForm.controls['motorUsage'].value);
                        if(entry){   
                          let bodyTypeStatus = entry?.BodyType;
                          this.mainBodyTypeList = this.motorTypeList.filter(ele=>ele.BodyType==bodyTypeStatus);
                          if(type=='change' && !this.editSection){ this.bodyTypeValue = null;this.vehicleForm.controls['bodyType'].setValue('')  }
                          this.bodytypeList = defaultObj.concat(this.mainBodyTypeList);
                        }
                      }
                    
                  }
                    //this.fields[0].fieldGroup[0].fieldGroup[1].props.options = defaultObj.concat(this.motorTypeList);
                    
                }
              }
            }
            
            
        }

      },
      (err) => { },
    );
  }
  goToCarInsurancePremium() {
       // Navigate to the car-insurance-premium route
      let dob = this.customerForm.controls['dob'].value,makeDesc=null,usageDesc=null,usageId=null,startDate = "",endDate = "",bodyDesc=null,bodyType=null,makeid=null,modelid=null,modelDesc=null;
      bodyType= this.vehicleForm.controls['bodyType'].value;
      if(bodyType) bodyDesc = this.bodytypeList.find(ele=>ele.Code==bodyType)?.CodeDesc;
      makeid = this.vehicleForm.controls['make'].value;
      if(makeid) makeDesc = this.makeList.find(ele=>ele.Code==makeid)?.CodeDesc;
      modelid = this.vehicleForm.controls['model'].value;
      if(modelid) modelDesc = this.modelList.find(ele=>ele.Code==modelid)?.CodeDesc;
      if(modelDesc==null || modelDesc==undefined){ modelid='99999'; modelDesc=this.vehicleForm.controls['modelDesc'].value}
      usageId= this.vehicleForm.controls['motorUsage'].value;
      if(usageId) usageDesc = this.motorUsageList.find(ele=>ele.Code==usageId)?.CodeDesc;
      let dateList = String(dob).split('/')
      if(dateList.length==1) dob = this.datePipe.transform(dob,'dd/MM/yyyy');
      var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    this.policyStartDate = this.datePipe.transform(new Date(year, month, day),'dd/MM/yyyy');
    this.policyEndDate = this.datePipe.transform(new Date(year + 1, month, day-1),'dd/MM/yyyy');
    startDate = this.policyStartDate;endDate = this.policyEndDate;
      let ReqObj = {
        "CustomerName": this.customerForm.controls['customerName'].value,
        "LoginId": this.userdetails?.LoginId,
        "SubUserType": this.userdetails?.SubUserType,
        "UserType": this.userdetails?.UserType,
        "ApplicationId": "1",
        "RequestReferenceNo": null,
        "VehicleId": "1",
        "CreatedBy": this.userdetails?.LoginId,
        "InsuranceId": this.insuranceId,
        "BranchCode": this.branchCode,
        "BrokerBranchCode": this.userdetails?.BrokerBranchCode,
        "AgencyCode": this.userdetails?.AgencyCode,
        "ProductId": "5",
        "SavedFrom": "SQ",
        "SectionId": [
          this.vehicleForm.controls['insuranceType'].value
        ],
        "MobileCode": this.customerForm.controls['mobileCode'].value,
        "MobileNumber": this.customerForm.controls['mobileNo'].value,
        "Chassisnumber": "",
        "Insurancetype": this.vehicleForm.controls['insuranceType'].value,
        "InsuranceClass": this.vehicleForm.controls['insuranceType'].value,
        "Motorusage": usageDesc,
        "MotorusageId": this.vehicleForm.controls['motorUsage'].value,
        "Vehiclemake": makeDesc,
        "VehiclemakeId": this.vehicleForm.controls['make'].value,
        "VehicleModel": null,
        "VehcilemodelId": this.vehicleForm.controls['model'].value,
        "PurchaseDate": null,
        "EngineCapacity": this.vehicleForm.controls['engineCapacity'].value,
        "Deductibles": null,
        "ManufactureYear": this.vehicleForm.controls['manufactureYear'].value,
        "Gpstrackinginstalled": "N",
        "NcdYn": "N",
        "VehicleType": bodyDesc,
        "VehicleTypeId": this.vehicleForm.controls['bodyType'].value,
        "CarAlarmYn": "N",
        "PolicyStartDate": startDate,
        "PolicyEndDate": endDate,
        "CustomerCode": this.userdetails?.CustomerCode,
        "BdmCode": this.userdetails?.CustomerCode,
        "SourceTypeId": "Broker",
        "SumInsured": this.vehicleForm.controls['vehicleSumInsured'].value,
        "AcccessoriesSumInsured": null,
        "ExchangeRate": "1.0",
        "Currency": this.userdetails.CurrencyId,
        "HavePromoCode": "N",
        "SearchFromApi": false,
        "PreviousInsuranceYN": "N",
        "PreviousLossRatio": "",
        "FuelType": this.customerForm.controls['customerName'].value,
        "Occupation": this.customerForm.controls['occupation'].value,
        "ClaimType": this.vehicleForm.controls['claimType'].value,
        "DriverDetails": {
            "DriverName": this.customerForm.controls['customerName'].value,
            "DriverType": "1",
            "Gender": "M",
            "LicenseNo": this.vehicleForm.controls['license'].value,
            "MaritalStatus": null,
            "CountryId": this.userdetails.CountryId,
            "StateId": null,
            "CityId": null,
            "AreaGroup": null,
            "SuburbId": null,
            "DriverExperience": this.vehicleForm.controls['drivingexp'].value,
            "CreatedBy": this.userdetails?.LoginId,
            "DriverDob": dob,
            "QuoteNo": null,
            "RequestReferenceNo": null,
            "RiskId": "1",
            "InsuranceId": this.insuranceId,
            "EndorsementYn": "N",
            "EndorsementDate": null,
            "EndorsementEffectiveDate": null,
            "EndorsementRemarks": null,
            "EndorsementType": null,
            "EndorsementTypeDesc": null,
            "EndtCategoryDesc": null,
            "EndtCount": null,
            "EndtPrevPolicyNo": null,
            "EndtPrevQuoteNo": null,
            "EndtStatus": null,
            "IsFinanceEndt": null,
            "OrginalPolicyNo": null,
            "Ncb": "0",
            "ExcessLimit": null,
            "Deductibles": null
        }
      }
      let urlLink = `${this.motorApiUrl}api/savemotordetails`;
    this.shared.onPostMethodSync(urlLink,ReqObj).subscribe(
      (data: any) => {
        let res:any = data;
        if(data.ErrorMessage.length!=0){
          if(res.ErrorMessage){
          }
        }
        else{
          if(data.Result?.length!=0){
            this.vehicleDetailsList = [];
            this.vehicleDetailsList.push(ReqObj);
            let entry = this.vehicleDetailsList[0];
            entry['PolicyEndDate'] = endDate;
            entry['PolicyStartDate'] = startDate;
            this.quoteRefNo = data?.Result[0]?.RequestReferenceNo;
            this.customerReferenceNo = data?.Result[0]?.CustomerReferenceNo;
            sessionStorage.setItem('customerReferenceNo',data?.Result[0]?.CustomerReferenceNo)
            sessionStorage.setItem('quoteReferenceNo',data?.Result[0]?.RequestReferenceNo);
            let i=0;
            for(let veh of data.Result){
              entry['MSRefNo'] = data?.Result[0].MSRefNo;
              entry['VdRefNo'] = data?.Result[0].VdRefNo;
              entry['CdRefNo'] = data?.Result[0].CdRefNo;
              entry['Active'] = true;
              entry['VehicleId'] = data.Result[0].VehicleId;
              this.onCalculateVehDetails(veh,'proceedSave',i,data.Result.length,1);
              i+=1;
            }
          }
         
        }
    });
    //
  }
  onCalculateVehDetails(vehicleDetails,type,entry,totalCount,sectionCount){
    console.log(this.individualCalcIndex,totalCount)
    let createdBy="";
          let coverModificationYN = 'N';
          let quoteStatus = sessionStorage.getItem('QuoteStatus');
          if(quoteStatus=='AdminRP'){
              createdBy = this.vehicleDetailsList[0].CreatedBy;
          }
          else{
            createdBy = this.userdetails.LoginId;
          }
          
          let endDate:any = null;
          // else if(this.endorsementSection && this.enableRemoveVehicle && vehicleDetails.Status!='D'){
          //   coverModificationYN = 'N';
          // }
          if(this.policyEndDate){
            if(String(this.policyEndDate).includes('/')) endDate = this.policyEndDate;
            else endDate = this.datePipe.transform(this.policyEndDate, "dd/MM/yyyy");
          }
          let effectiveDate=null;
            if(this.policyStartDate){
              if(String(this.policyStartDate).includes('/')) effectiveDate = this.policyStartDate;
              else effectiveDate = this.datePipe.transform(this.policyStartDate, "dd/MM/yyyy");
            }
          let ReqObj = {
              "InsuranceId": this.insuranceId,
              "BranchCode": this.branchCode,
              "AgencyCode": this.userdetails.AgencyCode,
              "SectionId": vehicleDetails?.SectionId,
              "ProductId": '5',
              "MSRefNo": vehicleDetails?.MSRefNo,
              "VehicleId": vehicleDetails?.VehicleId,
              "LocationId": vehicleDetails?.LocationId,
              "CdRefNo": vehicleDetails?.CdRefNo,
              "DdRefNo": vehicleDetails?.DdRefNo,
              "VdRefNo": vehicleDetails?.VdRefNo,
              "CreatedBy": createdBy,
              "productId": '5',
              "sectionId": vehicleDetails?.SectionId,
              "RequestReferenceNo": this.quoteRefNo,
              "EffectiveDate": effectiveDate,
              "PolicyEndDate": endDate,
              "CoverModification": coverModificationYN
          }
          let urlLink = `${this.CommonApiUrl}calculator/calc`;
          this.shared.onPostMethodSync(urlLink,ReqObj).subscribe(
            (data: any) => {
              this.individualCalcIndex +=1;
              this.router.navigate(['/car-insurance-premium']);
              // this.router.got(['/car-insurance-premium']); 
            });
  }
  showCustomerInfo = false;

  onContinue() {
    if(this.vehicleForm.valid){
      this.showCustomerInfo = true; 
    }
  }

  closePopup() {
    this.showCustomerInfo = false; // Hide the popup
  }

  
}
