import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../Auth/auth.service';
import { SharedService } from '../shared/shared.service';
import * as Mydatas from '../app-config.json';

@Component({
  selector: 'app-car-insurance-premium',
  templateUrl: './car-insurance-premium.component.html',
  styleUrls: ['./car-insurance-premium.component.scss']
})
export class CarInsurancePremiumComponent {


  // otp:string ='';
  // verificationResult:string ='';
  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  public CommonApiUrl: any = this.AppConfig.CommonApiUrl;
  encryptedValue: any = null; vehicleDetailsList: any[] = [];
  branchselection: boolean = false; vehicleData: any[] = [];
  branchList: any[] = []; userDetails: any = null; userType: any = null;
  branchValue: any = null; subuserType: any = null;endorsementId:any=null;
  b2cType: any = null; agencyCode: any =null;adminRemarks:any=null;
  branchCode: any = null; productId:any=null;endorsementCategory: any;
  endorsementSection: boolean;currencyCode:any=null;selectedCoverList:any[]=[];
  adminSection:boolean=false;quoteNo:any=null;rejectedReason:any=null;
  productName:any=null;quoteRefNo:any=null;statusValue:any=null;
  SourceType: any;endorsementType:any=null;maxDate:any=null;
  commissionValue: any;emipolicytype:any=null;customerReferenceNo:any=null;
  commissionPercent: any;finalizeYN:any='N';localPremiumCost:any=null;
  policyStartDate: any=null;loginType:any=null;promoCode:any=null;
  policyEndDate: any=null;insuranceId:any=null;havePromoCode:any=null;
  uwReferralSection: boolean=false;brokerbranchCode:any=null;
  coverModificationYN: string;customerDetails:any=null;
  totalPremium: any=null;
  emiYN: any='N';minDate:any=null;
  showSection: boolean=false;
  isMannualReferal: any=null;
  selectedRowData: any=null;
  coverSection: boolean=false;
  selectedVehicleList: any[]=[];
  emiPeriod: any=null;requestReferenceNo:any=null;
  companyId: any=null;
  LoginId:any=null;
  OtpUser:any=null;
  CustomerName: any=null;
  userMobileCode: any=null;
  UserMobileNo:any=null;
  UserWhatsappCode: any=null;
  UserWhatsappNo:any=null;
  ProductId:any=null;
  TemplateName:any=null;
  submit: boolean;
  OtpBtnTime: any=null;
  OtpBtnEnable: boolean;
  otpId: any;
  otpGenerated: any;
  otpSection: boolean;
  otppage: boolean;
  otpValue: string;
  MobileCodeDesc: any;
  MobileNo: any;
  ClientName: any;
  EmailId: any;
  lastMobileNo: any;
  mobileCodeList: any[]=[];
  Accessum: any=null;

constructor(private _formBuilder: FormBuilder,
    private authService: AuthService,
     private sharedService: SharedService,private router: Router,) {
        // Navigate to car-customer-details page
       // this.router.navigate(['/car-customer-details']);

    this.userDetails = JSON.parse(sessionStorage.getItem('Userdetails'));
    let loginType = sessionStorage.getItem('resetLoginDetails');
    this.userType = this.userDetails?.Result?.UserType;
    this.subuserType = sessionStorage.getItem('typeValue');
    this.b2cType = sessionStorage.getItem('b2cType');
    this.agencyCode = this.userDetails.Result.OaCode;
    this.branchCode = this.userDetails.Result.BranchCode;
    this.branchList = this.userDetails.Result.LoginBranchDetails;
    this.productId = this.userDetails.Result.ProductId;
    this.productName = this.userDetails.Result.ProductName;
    this.insuranceId = this.userDetails.Result.InsuranceId;
    this.brokerbranchCode = this.userDetails.Result.BrokerBranchCode;
    this.subuserType = sessionStorage.getItem('typeValue');
      if (this.subuserType == 'b2c' || this.subuserType == 'B2C Broker') { }
      this.loginType = this.userDetails.Result.LoginType;
      let finalize = sessionStorage.getItem('FinalizeYN');
      if (finalize) this.finalizeYN = finalize;
      if (loginType) {
      }
    }
    ngOnInit(): void {
      this.quoteRefNo = sessionStorage.getItem('quoteReferenceNo');
      this.requestReferenceNo = this.quoteRefNo;
      this.minDate = new Date();
      var d = this.minDate;
      var year = d.getFullYear();
      var month = d.getMonth();
      var day = d.getDate();
      this.maxDate = new Date(year, month, day+90);
      let quoteNo = sessionStorage.getItem('quoteNo');
      if(quoteNo) this.quoteNo = quoteNo;
      let referenceNo =  sessionStorage.getItem('customerReferenceNo');
      if(referenceNo){
        this.getCustomerDetails(referenceNo);
      }
      let quoteStatus = sessionStorage.getItem('QuoteStatus');
      if(quoteStatus=='AdminRP' || quoteStatus == 'AdminRA' || quoteStatus == 'AdminRE'){
        if(quoteStatus=='AdminRP') this.statusValue ="RP";
        else if(quoteStatus =='AdminRA') this.statusValue ="RA";
        else if(quoteStatus =='AdminRE') this.statusValue ="RE";
          this.adminSection = true;
      }
      else{
        if(quoteStatus) this.statusValue = quoteStatus;
        this.adminSection = false;
      }
      if(this.productId=='5'  || this.productId=='59' || this.productId=='46' || this.productId=='29'){
        //let vehicles = JSON.parse(sessionStorage.getItem('vehicleDetailsList'));
        let vehicles:any;
        if(this.statusValue=='RA'){
          this.getUpdatedVehicleDetails();
        }
        else{
          if(vehicles && (this.productId=='5' || this.productId=='46' || this.productId=='29')){
            let vehicleList=[];
            let i=0;
            for(let veh of vehicles){
              if(i==0) veh['Collapse'] = true;
              else veh['Collapse'] = false;
              i+=1;
              vehicleList.push(veh);
              if(i==vehicles.length){
                  this.vehicleDetailsList = vehicleList;
                  if(this.vehicleDetailsList.some(ele=>ele.ManualReferalYn=='Y') && !this.adminSection){  
                    this.isMannualReferal = "Y";
                    console.log('MannnnnnnnReferral', this.isMannualReferal);
                  }
                  if(this.statusValue=='RP' && !this.adminSection){
                    
                    if(!this.vehicleDetailsList.some(ele=>ele.Status=='RP') && this.isMannualReferal!='Y'){
                      this.statusValue = null;
                      sessionStorage.removeItem('QuoteStatus')
                    }
                  }
                  this.selectedRowData = this.vehicleDetailsList[0];
                  this.onSelectSection();
                  this.coverSection = true;
                  
              }
            }
          }
          else{

            this.getUpdatedVehicleDetails();
          }
        }
      }
      else if(this.productId!='5' && this.productId!='59' && this.productId!='46' && this.productId!='29'){
        // let coverListObj = JSON.parse(sessionStorage.getItem('travelCoverListObj'));
        // if(coverListObj){
        //   this.getCoverList(coverListObj);
        // }
        this.quoteRefNo = sessionStorage.getItem('quoteReferenceNo');
        this.requestReferenceNo = this.quoteRefNo;
        let quoteNo = sessionStorage.getItem('quoteNo');
        if(quoteNo) this.quoteNo = quoteNo;
        this.getUpdatedVehicleDetails();
      }
    }
    getCustomerDetails(referenceNo){
      let ReqObj = {
        "CustomerReferenceNo": referenceNo
      }
      let urlLink = `${this.CommonApiUrl}api/getcustomerdetails`;
      this.sharedService.onPostMethodSync(urlLink, ReqObj).subscribe(
        (data: any) => {
          console.log(data);
          if(data.Result){
            this.customerDetails = data.Result;
          }
        },
        (err) => { },
      );
    }
    getUpdatedVehicleDetails(){
      let referenceNo = sessionStorage.getItem('quoteReferenceNo');
      if (referenceNo) {
        this.quoteRefNo = referenceNo;
        let ReqObj = {
          "ProductId": '5',
          "RequestReferenceNo": this.quoteRefNo
        }
        let urlLink = `${this.CommonApiUrl}api/view/calc`;
        this.sharedService.onPostMethodSync(urlLink, ReqObj).subscribe(
          (data: any) => {
            if (data.Result) {

              this.vehicleData = data.Result;
              if (this.vehicleData.length != 0) {
                let finalizeyn = this.vehicleData[0]?.FinalizeYn;
                if (finalizeyn != null) { this.finalizeYN = finalizeyn; sessionStorage.setItem('FinalizeYN', finalizeyn); }
                else { this.finalizeYN = 'N'; sessionStorage.removeItem('FinalizeYN') };
              }
              if (this.productId == '5' || this.productId == '29') {
                let j = 0; let datass: any = []
                if (this.vehicleData.length > 1) {
                  if (this.vehicleData[0]?.RiskDetails?.InsuranceClass == this.vehicleData[1]?.RiskDetails?.InsuranceClass) {
                    this.emipolicytype = this.vehicleData[0]?.RiskDetails?.InsuranceClass;
                  }
                  else {
                    this.emipolicytype = '99999';
                  }

                }
                else {
                  this.emipolicytype = this.vehicleData[0]?.RiskDetails?.InsuranceClass;
                }
                // this.emipolicytype=this.vehicleData[0]?.RiskDetails?.InsuranceClass;
                // console.log('KKKKKKKKKKKK',this.emipolicytype);
              }
              else {
                this.emipolicytype = '99999';
              }

              let vehicleList: any[] = [];
              if (this.vehicleData.length != 0) {
                this.SourceType = this.vehicleData[0].SourceType;
                this.commissionValue = this.vehicleData[0].CommissionPercentage;
                this.commissionPercent = this.vehicleData[0].CommissionPercentage;
                this.policyStartDate = this.vehicleData[0]?.PolicyStartDate;
                this.policyEndDate = this.vehicleData[0]?.PolicyEndDate;
                let referralList = this.vehicleData.filter(ele => (ele.UWReferral != null && ele.UWReferral.length != 0) || ele.MasterReferral.length != 0);
                if (referralList.length != 0) this.uwReferralSection = true;
                if (this.vehicleData[0].EndtTypeMaster != null) {
                  let quoteDetails = this.vehicleData[0].EndtTypeMaster
                  this.endorsementType = quoteDetails.Endtcategdesc;
                  this.endorsementCategory = quoteDetails.Endttypecategory;
                  if (!JSON.parse(sessionStorage.getItem('endorseTypeId'))) {
                    let obj = {
                      "EndtTypeId": Number(quoteDetails?.Endttypeid),
                      "FieldsAllowed": quoteDetails.Endtdependantfields.split(','),
                      "EffectiveDate": quoteDetails.Endorsementeffdate,
                      "Remarks": quoteDetails.Remarks,
                      "Category": quoteDetails.Endttypecategory,
                      "EndtName": quoteDetails.Endttype,
                      "PolicyNo": quoteDetails?.PolicyNo
                    }
                    sessionStorage.setItem('endorsePolicyNo', this.vehicleData[0].OriginalPolicyNo);
                    //sessionStorage.setItem('endorsePolicyNo',)
                    sessionStorage.setItem('endorseTypeId', JSON.stringify(obj));
                    this.endorsementSection = true;
                    let endorseObj = JSON.parse(sessionStorage.getItem('endorseTypeId'))
                    if (endorseObj) {
                      console.log("Endorse obj", endorseObj)
                      
                    }
                  }
                }
                if (this.vehicleData[0].HavePromoCode) {
                  this.havePromoCode = this.vehicleData[0].HavePromoCode;
                  this.promoCode = this.vehicleData[0].PromoCode;
                }
                else {
                  this.havePromoCode = "N";
                  this.promoCode = null;
                }
                let admRemarks = this.vehicleData[0].AdminRemarks;
                if (admRemarks) {
                  this.adminRemarks = admRemarks.split('~');

                }
                this.currencyCode = this.vehicleData[0]?.Currency;
                let i = 0;
                for (let veh of this.vehicleData) {
                  veh['ReferralList'] = [];
                  if (veh.MasterReferral.length != 0) {
                    for (let master of veh.MasterReferral) {
                      veh['ReferralList'].push(master.ReferralDesc)
                    }
                  }
                  if (veh.UWReferral.length != 0) {
                    for (let master of veh.UWReferral) {
                      veh['ReferralList'].push(master.QuestionDesc)
                    }
                  }
                  if (veh.EndorsementYn == 'Y') {
                    if (this.endorsementSection == false) {

                    }
                  }
                  // if(veh.ReferalRemarks){
                  //   veh['ReferralList']= veh.ReferalRemarks.split('~');
                  // }
                  if (this.productId == '63') veh.VehicleId = veh.LocationId;
                  if (veh.VehicleId) veh['Vehicleid'] = veh.VehicleId;
                  veh['Active'] = true;
                  let coverList = veh.CoverList;
                  let baseCovers = [], otherCovers = [];
                  baseCovers = coverList.filter(ele => ele.CoverageType == 'B');
                  otherCovers = coverList.filter(ele => ele.CoverageType != 'B');
                  veh.CoverList = baseCovers.concat(otherCovers)
                  if (i == 0) {
                    veh['Collapse'] = true;
                    //this.remarks = veh.AdminRemarks;
                    vehicleList.push(veh);
                  }
                  else {
                    veh['Collapse'] = false;
                    vehicleList.push(veh);
                  }
                  i += 1;
                  if (i == this.vehicleData.length) {
                    console.log("Vehiclessss", this.vehicleData, data.Result)
                    console.log("Final Vehicle List", vehicleList)
                    //sessionStorage.setItem('vehicleDetailsList',JSON.stringify(vehicleList));
                    if (this.productId != '4' && this.productId != '5' && this.productId != '46' && this.productId != '29') {

                      this.vehicleData = vehicleList;
                      this.filterVehicleList();
                    }
                    else {
                      this.vehicleDetailsList = vehicleList;
                      this.checkSelectedCovers();
                    }
                  }
                }
              }

            }
          },
          (err) => { },
        );
      }
    }
    checkCoverSelection(vehicleData,coverData){
      if(this.finalizeYN=='Y') return true;
      else if(this.endorsementSection && !this.adminSection && this.statusValue!='RA'){
        if(vehicleData.EndorsementYN=='Y') return false;
        else return true;  
      }
      else if(!this.adminSection && this.statusValue=='RA' && (((coverData.isSelected=='D' || coverData.isSelected=='O' || coverData.isSelected=='Y' || coverData?.UserOpt=='Y') && !this.endorsementSection) || 
      (this.endorsementSection && (coverData.UserOpt=='Y' || coverData.isSelected=='D' || coverData.isSelected=='O')))) return true;
      else return false;
    }
    filterVehicleList(){
      let vehicleList = this.vehicleData.filter(ele => ele.SectionId == '1');
      if (this.vehicleData.length != 0) {
        let i = 0;
        this.vehicleDetailsList = [];
        let k = 0;
        for (let vehicle of this.vehicleData) {
          let entry = null;
          console.log("Filter Details", vehicleList, this.vehicleData)
          if (this.productId == '1' || this.productId == '14' || this.productId == '32' || this.productId == '61' || this.productId == '39' || this.productId == '25' || this.productId == '16' || this.productId == '6' || this.productId == '59') entry = vehicleList.find(ele => ele.LocationId == vehicle.LocationId);
          else entry = vehicleList.find(ele => ele.VehicleId == vehicle.VehicleId || ele.RiskDetails.RiskId == vehicle.RiskDetails.RiskId);
          if (entry && vehicle.SectionId != '1') {
            //if(entry.SectionId==vehicle.SectionId){
            let j = 0;
            for (let cover of vehicle.CoverList) {
              cover['SectionId'] = vehicle.SectionId;
              cover['SectionName'] = vehicle.SectionName;
              cover['VehicleId'] = vehicle.VehicleId;
              cover['RiskDetails'] = vehicle.RiskDetails;
              j += 1;
              if (j == vehicle.CoverList.length) entry.CoverList = entry.CoverList.concat(vehicle.CoverList);
            }

            // }
            // else{
            //   vehicleList.push(vehicle);
            // }
          }
          else if (vehicle.SectionId != '1') {
            let j = 0;
            for (let cover of vehicle.CoverList) {
              cover['SectionId'] = vehicle.SectionId;
              cover['SectionName'] = vehicle.SectionName;
              cover['VehicleId'] = vehicle.VehicleId;
              cover['RiskDetails'] = vehicle.RiskDetails;
              j += 1;
              if (j == vehicle.CoverList.length) vehicleList.push(vehicle)
            }
          }
          i += 1;
          if (i == this.vehicleData.length) {
            this.vehicleDetailsList = vehicleList;
            console.log("Final List", this.vehicleDetailsList)
            this.checkSelectedCovers();
          }
        }
      }
    }
    checkSelectedCovers(){
      if (this.vehicleDetailsList.length != 0) {
        if (this.vehicleDetailsList[0].CoverList.length != 0) {
          this.currencyCode == this.vehicleDetailsList[0].CoverList[0].Currency;
        }
        let j = 0;
        for (let veh of this.vehicleDetailsList) {
          veh['totalPremium'] = 0;
          let i = 0;
          let coverList: any[] = veh.CoverList;
          for (let cover of coverList) {
            cover['ExcessDesc'] = 'None';
            let fieldList = [];
            if (cover.Endorsements != null && veh.Status != 'D') {

              cover['DifferenceYN'] = 'Y';
              if (veh?.EndtTypeMaster?.Endtdependantfields) {
                fieldList = veh?.EndtTypeMaster?.Endtdependantfields.split(',')
              }
            }
            if (cover.Endorsements != null && !this.endorsementSection) {
              this.endorsementSection = true;

              let obj = {
                "EndtTypeId": cover.Endorsements[0].EndorsementId,
                "FieldsAllowed": fieldList,
                "EffectiveDate": cover.EffectiveDate,
                "Remarks": null,
                "Category": veh?.EndtTypeMaster?.Endttypecategory,
                "EndtName": cover.Endorsements[0].EndorsementDesc,
                "PolicyNo": null
              }
              
              
              sessionStorage.setItem('endorseTypeId', JSON.stringify(obj));
            }
            if ((((cover.isSelected == 'D' || cover.isSelected == 'O' || cover.isSelected == 'Y' || cover?.UserOpt == 'Y') && !this.endorsementSection) ||
              (this.endorsementSection && (cover.UserOpt == 'Y' || cover.isSelected == 'D' || cover.isSelected == 'O'))) && cover.SubCovers == null) {
              // if(this.endorsementId == 846 && veh.Status=='D'){
              //   cover['selected']= false;
              //   this.onSelectCover(cover,false,veh.Vehicleid,veh,'coverList','change');
              // }
              // else{
              this.onSelectCover(cover, true, cover.VehicleId, veh, 'coverList', 'direct');
              //}

            }
            else {
              console.log("Not Selected 1", cover);
              cover['selected'] = false;
            }
            if (cover.SubCovers != null) {
              let k = 0;
              for (let sub of cover.SubCovers) {
                if (sub.isSelected == 'D' || sub.isSelected == 'O' || sub.isSelected == 'Y' || sub?.UserOpt == 'Y') {
                  this.onChangeSubCover(sub, cover, veh, true, null);
                }
                k += 1;
                if (k == cover.SubCovers) {
                  i += 1;
                  if (i == coverList.length) {
                    let defaultList = coverList.filter(ele => ele.isSelected == 'D' || ele.UserOpt == 'Y');
                    let otherList = coverList.filter(ele => ele.isSelected != 'D' && ele.UserOpt != 'Y')
                    veh.CoverList = defaultList.concat(otherList);
                    if (this.adminSection) veh.CoverList = coverList.filter(ele => ele.isSelected == 'D' || ele?.UserOpt == 'Y')
                  }
                }
              }
            }
            else {
              i += 1;
              if (i == coverList.length) {
                let defaultList = coverList.filter(ele => ele.isSelected == 'D' || ele.UserOpt == 'Y');
                let otherList = coverList.filter(ele => ele.isSelected != 'D' && ele.UserOpt != 'Y')
                veh.CoverList = defaultList.concat(otherList);
                if (this.adminSection) veh.CoverList = coverList.filter(ele => ele.isSelected == 'D' || ele?.UserOpt == 'Y')
              }
            }
          }
          j += 1;
          if (j == this.vehicleDetailsList.length) {
            if (this.endorsementId == 846) {
              let vehicles = this.vehicleDetailsList.filter(ele => ele.Status == 'D');
              if (vehicles.length != 0) {
                let n = 0;
                for (let veh of vehicles) {
                  let SectionEntry: any[] = [];
                  SectionEntry = this.vehicleDetailsList.filter(ele => ele.Status == 'E' && ele.SectionId == veh.SectionId);
                  let coverList: any[] = veh.CoverList;
                  let j = 0;
                  for (let cover of coverList) {
                    if (((cover.isSelected == 'D' || cover.isSelected == 'O' || cover.isSelected == 'Y' || cover?.UserOpt == 'Y') && !this.endorsementSection) ||
                      (this.endorsementSection && (cover.UserOpt == 'Y' || cover.isSelected == 'Y'))) {
                      cover['selected'] = false;
                      this.onSelectCover(cover, false, cover.VehicleId, veh, 'coverList', 'change');
                      cover['DifferenceYN'] = 'N';
                      if (SectionEntry.length != 0) {
                        let coverList = SectionEntry[0]?.CoverList;
                        let covers = coverList.filter(ele => ele.CoverId == cover.CoverId);

                        if (!(covers[0].UserOpt == 'Y' || covers[0].isSelected == 'D' || covers[0].isSelected == 'O')) {
                          console.log("Opted Sections", SectionEntry[0], covers)
                          covers[0]['selected'] = true;
                          this.onSelectCover(covers[0], true, covers[0].VehicleId, SectionEntry[0], 'coverList', 'change');
                          covers[0]['DifferenceYN'] = 'Y';
                        }
                      }

                    }

                    j += 1;
                    if (j == coverList.length) n += 1;
                  }

                  if (n == vehicles.length) {
                    if (this.quoteNo != "null" && this.quoteNo != null) {
                    }
                    if (this.quoteRefNo != "null" && this.quoteRefNo != null) {
                      this.getEditQuoteDetails();
                    }
                    else {

                    }
                  }
                }
              }
              else {
                if (this.quoteNo != "null" && this.quoteNo != null) {
                  //this.getEditQuoteDetails();
                }
                if (this.quoteRefNo != "null" && this.quoteRefNo != null) {
                  //this.updateComponent.quoteNo = this.quoteNo;
                  this.getEditQuoteDetails();
                }
                else {

                }
              }
            }
            else {
              if (this.quoteNo != "null" && this.quoteNo != null) {
                //this.getEditQuoteDetails();
              }
              if (this.quoteRefNo != "null" && this.quoteRefNo != null) {
                //this.updateComponent.quoteNo = this.quoteNo;
                this.getEditQuoteDetails();
              }
              else {

              }
            }

            //this.onGetCoverListById();
          }
        }


      }
    }
    onChangeSubCover(subCover,cover,vehicle,event,element){
      if(subCover==undefined || subCover==null){
        if(element){
          subCover = cover.SubCovers.find(ele=>ele.SubCoverId==element.value)
        }
      }
      if(subCover.MultiSelectYn=='Y'){
          if(event){
            if(this.selectedCoverList.length!=0){
              let entry = this.selectedCoverList.filter(ele=>ele.Id==vehicle.VehicleId && ele.LocationId==vehicle.LocationId );
              if(entry.length==0){
                let id=null;
                if(cover.VehicleId) id= cover.VehicleId; else id=vehicle.VehicleId
                let element = {
                    "Covers": [
                      {
                        "CoverId": cover.CoverId,
                        "SubCoverId": subCover.SubCoverId,
                        "SubCoverYn": "Y",
                        //"isReferal": rowData.isReferal
                      }
                    ],
                    "LocationId": vehicle.LocationId,
                    "Id": id,
                    "SectionId": cover.SectionId
                  }
                cover.PremiumIncludedTax = cover.PremiumIncludedTax+subCover.PremiumIncludedTax;
                cover.PremiumIncludedTax = cover.PremiumIncludedTax+subCover.PremiumIncludedTax;
                cover.selected = true;
                for(let sub of cover.SubCovers){
                  if(sub.SubCoverId==subCover.SubCoverId){
                    cover['isReferal'] = sub.isReferal;
                    cover['SumInsured'] = sub.SumInsured;
                    cover['Loadings'] = sub.Loadings;
                    cover['PremiumAfterDiscount'] = sub.PremiumAfterDiscount;
                    cover['MinimumPremium'] = sub.MinimumPremium;
                    cover['MinimumPremiumYn'] = sub?.MinimumPremiumYn;
                    cover['Discounts'] = sub?.Discounts;
                    cover['CalcType'] = sub?.CalcType;
                    cover['Rate'] = sub?.Rate;
                    cover['ExcessPercent'] = sub?.ExcessPercent;
                    cover['ExcessAmount'] = sub?.ExcessAmount;
                    cover['PremiumBeforeDiscount'] = sub.PremiumBeforeDiscount;
                    cover['ExchangeRate'] = sub?.ExchangeRate;
                    cover['PremiumExcluedTax'] = sub?.PremiumExcluedTax;
                    cover['PremiumIncludedTax'] = sub?.PremiumIncludedTax;
                    cover['Taxes'] = sub.Taxes;
                    cover['SubCoverId'] = sub.SubCoverId
                    sub['selected'] = true;
                  }
                  else{
                    sub['selected'] = false;
                  }
                }
                subCover['selected'] = true;
                this.selectedCoverList.push(element);
                console.log("Selected Covers",this.selectedCoverList)
                if(vehicle?.totalPremium){
                  if(cover.Endorsements!=null){
                    vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
                    vehicle['totalPremium'] =  vehicle['totalPremium']+cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
                  }
                  else{
                    vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + subCover.PremiumIncludedTax;
                    vehicle['totalPremium'] =  vehicle['totalPremium']+subCover.PremiumIncludedTax;
                  }
                
                }
                else{
                  if(cover.Endorsements!=null){
                    vehicle['totalLcPremium'] = cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
                    vehicle['totalPremium'] = cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
                  }
                  else{
                    vehicle['totalLcPremium'] =  cover.PremiumIncludedTax;
                    vehicle['totalPremium'] =  cover.PremiumIncludedTax;
                  }
                  
                }
                // if(vehicle?.totalPremium){
                //   vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + cover.PremiumIncludedTax;
                //   vehicle['totalPremium'] =  vehicle['totalPremium']+cover.PremiumIncludedTax;
                // }
                // else{
                //   vehicle['totalLcPremium'] =  cover.PremiumIncludedTax;
                //   vehicle['totalPremium'] =  cover.PremiumIncludedTax;
                // }
                  console.log("Total Premium",cover,vehicle)
                this.getTotalVehiclesCost();
                //this.totalPremium = this.totalPremium+rowData.PremiumIncludedTax
              }
              else{
               let sectionEntry = entry.find(ele=>ele.SectionId == cover.SectionId);
               if(sectionEntry == undefined){
                let id=null;
                if(cover.VehicleId) id= cover.VehicleId; else id=vehicle.VehicleId
                let element = {
                  "Covers": [
                    {
                      "CoverId": cover.CoverId,
                      "SubCoverId": subCover.SubCoverId,
                      "SubCoverYn": "Y",
                      //"isReferal": rowData.isReferal
                    }
                  ],
                  "LocationId": vehicle.LocationId,
                  "Id": id,
                  "SectionId": cover.SectionId
                }
                cover.PremiumIncludedTax = cover.PremiumIncludedTax+subCover.PremiumIncludedTax;
                cover.PremiumIncludedTax = cover.PremiumIncludedTax+subCover.PremiumIncludedTax;
  
                cover.selected = true;
                for(let sub of cover.SubCovers){
                  if(sub.SubCoverId==subCover.SubCoverId){
                    cover['isReferal'] = sub.isReferal;
                    cover['SumInsured'] = sub.SumInsured;
                    cover['Loadings'] = sub.Loadings;
                    cover['PremiumAfterDiscount'] = sub.PremiumAfterDiscount;
                    cover['MinimumPremium'] = sub.MinimumPremium;
                    cover['MinimumPremiumYn'] = sub?.MinimumPremiumYn;
                    cover['Discounts'] = sub?.Discounts;
                    cover['CalcType'] = sub?.CalcType;
                    cover['Rate'] = sub?.Rate;
                    cover['ExcessPercent'] = sub?.ExcessPercent;
                    cover['ExcessAmount'] = sub?.ExcessAmount;
                    cover['PremiumBeforeDiscount'] = sub.PremiumBeforeDiscount;
                    cover['ExchangeRate'] = sub?.ExchangeRate;
                    cover['PremiumExcluedTax'] = sub?.PremiumExcluedTax;
                    cover['PremiumIncludedTax'] = sub?.PremiumIncludedTax;
                    cover['Taxes'] = sub.Taxes;
                    cover['SubCoverId'] = sub.SubCoverId
                    sub['selected'] = true;
                  }
                  else{
                    sub['selected'] = false;
                  }
                }
                subCover['selected'] = true;
                this.selectedCoverList.push(element);
                if(vehicle?.totalPremium){
                  if(cover.Endorsements!=null){
                    vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
                    vehicle['totalPremium'] =  vehicle['totalPremium']+cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
                  }
                  else{
                    vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + subCover.PremiumIncludedTax;
                    vehicle['totalPremium'] =  vehicle['totalPremium']+subCover.PremiumIncludedTax;
                  }
                
                }
                else{
                  if(cover.Endorsements!=null){
                    vehicle['totalLcPremium'] = cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
                    vehicle['totalPremium'] = cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
                  }
                  else{
                    vehicle['totalLcPremium'] =  cover.PremiumIncludedTax;
                    vehicle['totalPremium'] =  cover.PremiumIncludedTax;
                  }
                  
                }
                  // if(vehicle?.totalPremium){
                  //   vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + cover.PremiumIncludedTax;
                  //   vehicle['totalPremium'] =  vehicle['totalPremium']+cover.PremiumIncludedTax;
                  // }
                  // else{
                  //   vehicle['totalLcPremium'] =  cover.PremiumIncludedTax;
                  //   vehicle['totalPremium'] =  cover.PremiumIncludedTax;
                  // }
                  console.log("Total Premium",cover,vehicle)
                  this.getTotalVehiclesCost();
               }
               else{
                 console.log("Sections",sectionEntry)
                let covers:any[] = sectionEntry.Covers;
                let findCover = covers.filter(ele=>ele.CoverId==cover.CoverId);
                if(findCover.length==0) {
                  let newEntry = {
                    "CoverId": cover.CoverId,
                    "SubCoverId":subCover.SubCoverId,
                    "SubCoverYn": "Y"
                    //"isReferal": rowData.isReferal
                  }
                  cover.PremiumIncludedTax = cover.PremiumIncludedTax+subCover.PremiumIncludedTax;
                  cover.PremiumIncludedTax = cover.PremiumIncludedTax+subCover.PremiumIncludedTax;
                  cover.selected = true;
                  for(let sub of cover.SubCovers){
                    if(sub.SubCoverId==subCover.SubCoverId){
                      cover['isReferal'] = sub.isReferal;
                      cover['SumInsured'] = sub.SumInsured;
                      cover['Loadings'] = sub.Loadings;
                      cover['PremiumAfterDiscount'] = sub.PremiumAfterDiscount;
                      cover['MinimumPremium'] = sub.MinimumPremium;
                      cover['MinimumPremiumYn'] = sub?.MinimumPremiumYn;
                      cover['Discounts'] = sub?.Discounts;
                      cover['CalcType'] = sub?.CalcType;
                      cover['Rate'] = sub?.Rate;
                      cover['ExcessPercent'] = sub?.ExcessPercent;
                      cover['ExcessAmount'] = sub?.ExcessAmount;
                      cover['PremiumBeforeDiscount'] = sub.PremiumBeforeDiscount;
                      cover['ExchangeRate'] = sub?.ExchangeRate;
                      cover['PremiumExcluedTax'] = sub?.PremiumExcluedTax;
                      cover['PremiumIncludedTax'] = sub?.PremiumIncludedTax;
                      cover['Taxes'] = sub.Taxes;
                      cover['SubCoverId'] = sub.SubCoverId
                      sub['selected'] = true;
                    }
                    else{
                      sub['selected'] = false;
                    }
                  }
                  subCover['selected'] = true;
                  sectionEntry.Covers.push(newEntry);
                  if(vehicle?.totalPremium){
                    if(cover.Endorsements!=null){
                      vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
                      vehicle['totalPremium'] =  vehicle['totalPremium']+cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
                    }
                    else{
                      vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + subCover.PremiumIncludedTax;
                      vehicle['totalPremium'] =  vehicle['totalPremium']+subCover.PremiumIncludedTax;
                    }
                  
                  }
                  else{
                    if(cover.Endorsements!=null){
                      vehicle['totalLcPremium'] = cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
                      vehicle['totalPremium'] = cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
                    }
                    else{
                      vehicle['totalLcPremium'] =  cover.PremiumIncludedTax;
                      vehicle['totalPremium'] =  cover.PremiumIncludedTax;
                    }
                    
                  }
                  console.log("Total Premium",cover,vehicle)
                  this.getTotalVehiclesCost();
                }
                else{
                  console.log("Finded Covers",findCover,sectionEntry)
                  let subCoverEntry = findCover.filter(ele=>ele.SubCoverId==subCover.SubCoverId);
                  if(subCoverEntry.length==0){
                    let newEntry = {
                      "CoverId": cover.CoverId,
                      "SubCoverId":subCover.SubCoverId,
                      "SubCoverYn": "Y"
                      //"isReferal": rowData.isReferal
                    }
                    cover.PremiumIncludedTax = cover.PremiumIncludedTax+subCover.PremiumIncludedTax;
                    cover.PremiumIncludedTax = cover.PremiumIncludedTax+subCover.PremiumIncludedTax;
                    cover.selected = true;
                    for(let sub of cover.SubCovers){
                      if(sub.SubCoverId==subCover.SubCoverId){
                        cover['isReferal'] = sub.isReferal;
                        cover['SumInsured'] = sub.SumInsured;
                        cover['Loadings'] = sub.Loadings;
                        cover['PremiumAfterDiscount'] = sub.PremiumAfterDiscount;
                        cover['MinimumPremium'] = sub.MinimumPremium;
                        cover['MinimumPremiumYn'] = sub?.MinimumPremiumYn;
                        cover['Discounts'] = sub?.Discounts;
                        cover['CalcType'] = sub?.CalcType;
                        cover['Rate'] = sub?.Rate;
                        cover['ExcessPercent'] = sub?.ExcessPercent;
                        cover['ExcessAmount'] = sub?.ExcessAmount;
                        cover['PremiumBeforeDiscount'] = sub.PremiumBeforeDiscount;
                        cover['ExchangeRate'] = sub?.ExchangeRate;
                        cover['PremiumExcluedTax'] = sub?.PremiumExcluedTax;
                        cover['PremiumIncludedTax'] = sub?.PremiumIncludedTax;
                        cover['Taxes'] = sub.Taxes;
                        cover['SubCoverId'] = sub.SubCoverId
                        sub['selected'] = true;
                      }
                      else{
                        sub['selected'] = false;
                      }
                    }
                    subCover['selected'] = true;
                    sectionEntry.Covers.push(newEntry);
                    if(vehicle?.totalPremium){
                      if(cover.Endorsements!=null){
                        vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
                        vehicle['totalPremium'] =  vehicle['totalPremium']+cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
                      }
                      else{
                        vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + subCover.PremiumIncludedTax;
                        vehicle['totalPremium'] =  vehicle['totalPremium']+subCover.PremiumIncludedTax;
                      }
                    
                    }
                    else{
                      if(cover.Endorsements!=null){
                        vehicle['totalLcPremium'] = cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
                        vehicle['totalPremium'] = cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
                      }
                      else{
                        vehicle['totalLcPremium'] =  cover.PremiumIncludedTax;
                        vehicle['totalPremium'] =  cover.PremiumIncludedTax;
                      }
                      
                    }
                    console.log("Total Premium",cover,vehicle)
                    this.getTotalVehiclesCost();
                  }
                  
                }
               }
              }
            }
            else{
              let id=null;
              if(cover.VehicleId) id= cover.VehicleId; else id=vehicle.VehicleId
              let element = {
                "Covers": [
                  {
                    "CoverId": cover.CoverId,
                    "SubCoverId": subCover.SubCoverId,
                    "SubCoverYn": "Y",
                    //"isReferal": rowData.isReferal
                  }
                ],
                "LocationId": vehicle.LocationId,
                "Id": id,
                "SectionId": cover.SectionId
              }
              cover.PremiumIncludedTax = cover.PremiumIncludedTax+subCover.PremiumIncludedTax;
              cover.PremiumIncludedTax = cover.PremiumIncludedTax+subCover.PremiumIncludedTax;
  
              cover.selected = true;
              for(let sub of cover.SubCovers){
                if(sub.SubCoverId==subCover.SubCoverId){
                  cover['isReferal'] = sub.isReferal;
                  cover['SumInsured'] = sub.SumInsured;
                  cover['Loadings'] = sub.Loadings;
                  cover['PremiumAfterDiscount'] = sub.PremiumAfterDiscount;
                  cover['MinimumPremium'] = sub.MinimumPremium;
                  cover['MinimumPremiumYn'] = sub?.MinimumPremiumYn;
                  cover['Discounts'] = sub?.Discounts;
                  cover['CalcType'] = sub?.CalcType;
                  cover['Rate'] = sub?.Rate;
                  cover['ExcessPercent'] = sub?.ExcessPercent;
                  cover['ExcessAmount'] = sub?.ExcessAmount;
                  cover['PremiumBeforeDiscount'] = sub.PremiumBeforeDiscount;
                  cover['ExchangeRate'] = sub?.ExchangeRate;
                  cover['PremiumExcluedTax'] = sub?.PremiumExcluedTax;
                  cover['PremiumIncludedTax'] = sub?.PremiumIncludedTax;
                  cover['Taxes'] = sub.Taxes;
                  cover['SubCoverId'] = sub.SubCoverId
                  sub['selected'] = true;
                }
                else{
                  sub['selected'] = false;
                }
              }
              subCover['selected'] = true;
              this.selectedCoverList.push(element);
              if(vehicle?.totalPremium){
                if(cover.Endorsements!=null){
                  vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
                  vehicle['totalPremium'] =  vehicle['totalPremium']+cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
                }
                else{
                  vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + subCover.PremiumIncludedTax;
                  vehicle['totalPremium'] =  vehicle['totalPremium']+subCover.PremiumIncludedTax;
                }
                
              }
              else{
                if(cover.Endorsements!=null){
                  vehicle['totalLcPremium'] = cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
                  vehicle['totalPremium'] = cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
                }
                else{
                  vehicle['totalLcPremium'] =  cover.PremiumIncludedTax;
                  vehicle['totalPremium'] =  cover.PremiumIncludedTax;
                }
                
              }
              this.getTotalVehiclesCost();
            }
          }
          else{
            if(this.selectedCoverList.length!=0){
              let entry = this.selectedCoverList.filter(ele=>ele.Id==vehicle.VehicleId && ele.LocationId==vehicle.LocationId);
              console.log("Entry List",entry);
              let sectionEntry = entry.find(ele=>ele.SectionId==cover.SectionId);
              sectionEntry.Covers = sectionEntry.Covers.filter(ele=>ele.SubCoverId!=subCover.SubCoverId )
              let covers:any[] = sectionEntry.Covers;
              let findCover = covers.filter(ele=>ele.CoverId==cover.CoverId);
              subCover['selected'] = false;
              
              cover.PremiumIncludedTax = cover.PremiumIncludedTax-subCover.PremiumIncludedTax;
              cover.PremiumIncludedTax = cover.PremiumIncludedTax-subCover.PremiumIncludedTax;
              if(vehicle?.totalPremium==null || vehicle?.totalPremium==undefined){ vehicle['totalLcPremium']=0;vehicle['totalPremium']=0 }
              if(vehicle?.totalPremium){
                vehicle['totalLcPremium'] = vehicle['totalLcPremium'] - subCover.PremiumIncludedTax;
                vehicle['totalPremium'] =  vehicle['totalPremium']-subCover.PremiumIncludedTax;
                if(findCover.length==0){cover['selected'] = false;  vehicle['totalPremium'] =  vehicle['totalPremium']-cover.PremiumIncludedTax; vehicle['totalLcPremium'] =  vehicle['totalLcPremium']-cover.PremiumIncludedTax;}
              }
              else{
                if(findCover.length!=0){
                  vehicle['totalLcPremium'] =  cover.PremiumIncludedTax;
                  vehicle['totalPremium'] =  cover.PremiumIncludedTax;
                }
              }
              this.getTotalVehiclesCost();
            }
          }
      }
      else{
        if(this.selectedCoverList.length!=0){
          let entry = this.selectedCoverList.filter(ele=>ele.Id==vehicle.VehicleId && ele.LocationId==vehicle.LocationId);
          if(entry.length==0){
            let id=null;
              if(cover.VehicleId) id= cover.VehicleId; else id=vehicle.VehicleId
            let element = {
                "Covers": [{ "CoverId": cover.CoverId,"SubCoverId": subCover.SubCoverId,"SubCoverYn": "Y" }],
                "LocationId": vehicle.LocationId,"Id": id,"SectionId": cover.SectionId
              }
              if((cover.PremiumIncludedTax!=null && cover.PremiumIncludedTax!='0' && cover.PremiumIncludedTax!=undefined)){
                
                vehicle['totalLcPremium'] = vehicle['totalLcPremium'] - cover.PremiumIncludedTax;
                vehicle['totalPremium'] =  vehicle['totalPremium'] - cover.PremiumIncludedTax; 
                cover.PremiumIncludedTax = 0;
                cover.PremiumIncludedTax=0;
              }
              cover.PremiumIncludedTax = subCover.PremiumIncludedTaxLC;
              cover.PremiumIncludedTax = subCover.PremiumIncludedTax;
            // cover.PremiumIncludedTax = cover.PremiumIncludedTax+subCover.PremiumIncludedTax;
            // cover.PremiumIncludedTax = cover.PremiumIncludedTax+subCover.PremiumIncludedTax;
            cover['selected'] = true;
            for(let sub of cover.SubCovers){
              if(sub.SubCoverId==subCover.SubCoverId){
                cover['isReferal'] = sub.isReferal;
                cover['SumInsured'] = sub.SumInsured;
                cover['Loadings'] = sub.Loadings;
                cover['PremiumAfterDiscount'] = sub.PremiumAfterDiscount;
                cover['MinimumPremium'] = sub.MinimumPremium;
                cover['MinimumPremiumYn'] = sub?.MinimumPremiumYn;
                cover['Discounts'] = sub?.Discounts;
                cover['CalcType'] = sub?.CalcType;
                cover['Rate'] = sub?.Rate;
                cover['ExcessPercent'] = sub?.ExcessPercent;
                cover['ExcessAmount'] = sub?.ExcessAmount;
                cover['PremiumBeforeDiscount'] = sub.PremiumBeforeDiscount;
                cover['ExchangeRate'] = sub?.ExchangeRate;
                cover['PremiumExcluedTax'] = sub?.PremiumExcluedTax;
                cover['PremiumIncludedTax'] = sub?.PremiumIncludedTax;
                cover['Taxes'] = sub.Taxes;
                cover['SubCoverId'] = sub.SubCoverId;
                sub['selected'] = true;
              }
              else{
                sub['selected'] = false;
              }
            }
            subCover['selected'] = true;
            this.selectedCoverList.push(element);
            if(vehicle?.totalPremium){
              if(cover.Endorsements!=null){
                vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
                vehicle['totalPremium'] =  vehicle['totalPremium']+cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
              }
              else{
                vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + subCover.PremiumIncludedTaxLC;
                vehicle['totalPremium'] =  vehicle['totalPremium']+subCover.PremiumIncludedTax;
              }
            
            }
            else{
              if(cover.Endorsements!=null){
                vehicle['totalLcPremium'] = cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
                vehicle['totalPremium'] = cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
              }
              else{
                vehicle['totalLcPremium'] =  cover.PremiumIncludedTax;
                vehicle['totalPremium'] =  cover.PremiumIncludedTax;
              }
            }
            
            this.getTotalVehiclesCost();
          }
          else{
            
           let sectionEntry = entry.find(ele=>ele.SectionId == cover.SectionId);
           if(sectionEntry == undefined){
            let id=null;
            if(cover.VehicleId) id= cover.VehicleId; else id=vehicle.VehicleId
            let element = {
              "Covers": [
                {
                  "CoverId": cover.CoverId,
                  "SubCoverId": subCover.SubCoverId,
                  "SubCoverYn": "Y",
                  //"isReferal": rowData.isReferal
                }
              ],
              "LocationId": vehicle.LocationId,
              "Id": id,
              "SectionId": cover.SectionId
            }
            if((cover.PremiumIncludedTax!=null && cover.PremiumIncludedTax!='0' && cover.PremiumIncludedTax!=undefined)){
              vehicle['totalLcPremium'] = vehicle['totalLcPremium'] - cover.PremiumIncludedTax;
              vehicle['totalPremium'] =  vehicle['totalPremium'] - cover.PremiumIncludedTax; 
              cover.PremiumIncludedTax = 0;
              cover.PremiumIncludedTax=0;
            }
            cover.PremiumIncludedTax = subCover.PremiumIncludedTaxLC;
            cover.PremiumIncludedTax = subCover.PremiumIncludedTax;
            cover.selected = true;
            cover.SubCoverId = subCover.SubCoverId;
            for(let sub of cover.SubCovers){
              if(sub.SubCoverId==subCover.SubCoverId){
                cover['isReferal'] = sub.isReferal;
                cover['SumInsured'] = sub.SumInsured;
                cover['Loadings'] = sub.Loadings;
                cover['PremiumAfterDiscount'] = sub.PremiumAfterDiscount;
                cover['MinimumPremium'] = sub.MinimumPremium;
                cover['MinimumPremiumYn'] = sub?.MinimumPremiumYn;
                cover['Discounts'] = sub?.Discounts;
                cover['CalcType'] = sub?.CalcType;
                cover['Rate'] = sub?.Rate;
                cover['ExcessPercent'] = sub?.ExcessPercent;
                cover['ExcessAmount'] = sub?.ExcessAmount;
                cover['PremiumBeforeDiscount'] = sub.PremiumBeforeDiscount;
                cover['ExchangeRate'] = sub?.ExchangeRate;
                cover['PremiumExcluedTax'] = sub?.PremiumExcluedTax;
                cover['PremiumIncludedTax'] = sub?.PremiumIncludedTax;
                cover['Taxes'] = sub.Taxes;
                cover['SubCoverId'] = sub.SubCoverId
                sub['selected'] = true;
              }
              else{
                sub['selected'] = false;
              }
            }
            subCover['selected'] = true;
            this.selectedCoverList.push(element);
            if(vehicle?.totalPremium){
              if(cover.Endorsements!=null){
                vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
                vehicle['totalPremium'] =  vehicle['totalPremium']+cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
              }
              else{
                vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + subCover.PremiumIncludedTaxLC;
                vehicle['totalPremium'] =  vehicle['totalPremium']+subCover.PremiumIncludedTax;
              }
            }
            else{
              if(cover.Endorsements!=null){
                vehicle['totalLcPremium'] = cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
                vehicle['totalPremium'] = cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
              }
              else{
                vehicle['totalLcPremium'] =  cover.PremiumIncludedTax;
                vehicle['totalPremium'] =  cover.PremiumIncludedTax;
              }
            }
              this.getTotalVehiclesCost();
           }
           else{
            
            let covers:any[] = sectionEntry.Covers;
            let findCover = covers.filter(ele=>ele.CoverId==cover.CoverId);
            if(findCover.length==0) {
              let newEntry = {
                "CoverId": cover.CoverId,
                "SubCoverId":subCover.SubCoverId,
                "SubCoverYn": "Y"
              }
              cover.SubCoverId = subCover.SubCoverId;
              cover.PremiumIncludedTax = subCover.PremiumIncludedTaxLC;
              cover.PremiumIncludedTax = subCover.PremiumIncludedTax;
              cover.selected = true;
              for(let sub of cover.SubCovers){
                if(sub.SubCoverId==subCover.SubCoverId){
                  cover['isReferal'] = sub.isReferal;
                  cover['SumInsured'] = sub.SumInsured;
                  cover['Loadings'] = sub.Loadings;
                  cover['PremiumAfterDiscount'] = sub.PremiumAfterDiscount;
                  cover['MinimumPremium'] = sub.MinimumPremium;
                  cover['MinimumPremiumYn'] = sub?.MinimumPremiumYn;
                  cover['Discounts'] = sub?.Discounts;
                  cover['CalcType'] = sub?.CalcType;
                  cover['Rate'] = sub?.Rate;
                  cover['ExcessPercent'] = sub?.ExcessPercent;
                  cover['ExcessAmount'] = sub?.ExcessAmount;
                  cover['PremiumBeforeDiscount'] = sub.PremiumBeforeDiscount;
                  cover['ExchangeRate'] = sub?.ExchangeRate;
                  cover['PremiumExcluedTax'] = sub?.PremiumExcluedTax;
                  cover['PremiumIncludedTax'] = sub?.PremiumIncludedTax;
                  cover['Taxes'] = sub.Taxes;
                  cover['SubCoverId'] = sub.SubCoverId;
                  sub['selected'] = true;
                }
                else{
                  sub['selected'] = false;
                }
              }
              subCover['selected'] = true;
              sectionEntry.Covers.push(newEntry);
              
              if(vehicle?.totalPremium){
                if(cover.Endorsements!=null){
                  vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
                  vehicle['totalPremium'] =  vehicle['totalPremium']+cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
                }
                else{
                  vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + subCover.PremiumIncludedTaxLC;
                  vehicle['totalPremium'] =  vehicle['totalPremium']+subCover.PremiumIncludedTax;
                }
              }
              else{
                if(cover.Endorsements!=null){
                  vehicle['totalLcPremium'] = cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
                  vehicle['totalPremium'] = cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
                }
                else{
                  vehicle['totalLcPremium'] =  cover.PremiumIncludedTax;
                  vehicle['totalPremium'] =  cover.PremiumIncludedTax;
                }
              }
              this.getTotalVehiclesCost();
            }
            else{
              console.log("Finded Covers",findCover,sectionEntry)
                let newEntry = {
                  "CoverId": cover.CoverId,
                  "SubCoverId":subCover.SubCoverId,
                  "SubCoverYn": "Y"
                }
                if((cover.PremiumIncludedTax!=null && cover.PremiumIncludedTax!='0' && cover.PremiumIncludedTax!=undefined)){
                  vehicle['totalLcPremium'] = vehicle['totalLcPremium'] - cover.PremiumIncludedTax;
                  vehicle['totalPremium'] =  vehicle['totalPremium'] - cover.PremiumIncludedTax; 
                  cover.PremiumIncludedTax = 0;
                  cover.PremiumIncludedTax= 0;
                }
                cover.SubCoverId = subCover.SubCoverId;
                cover.PremiumIncludedTax = subCover.PremiumIncludedTaxLC;
                cover.PremiumIncludedTax = subCover.PremiumIncludedTax;
                cover.selected = true;
                for(let sub of cover.SubCovers){
                  if(sub.SubCoverId==subCover.SubCoverId){
                    cover['isReferal'] = sub.isReferal;
                    cover['SumInsured'] = sub.SumInsured;
                    cover['Loadings'] = sub.Loadings;
                    cover['PremiumAfterDiscount'] = sub.PremiumAfterDiscount;
                    cover['MinimumPremium'] = sub.MinimumPremium;
                    cover['MinimumPremiumYn'] = sub?.MinimumPremiumYn;
                    cover['Discounts'] = sub?.Discounts;
                    cover['CalcType'] = sub?.CalcType;
                    cover['Rate'] = sub?.Rate;
                    cover['ExcessPercent'] = sub?.ExcessPercent;
                    cover['ExcessAmount'] = sub?.ExcessAmount;
                    cover['PremiumBeforeDiscount'] = sub.PremiumBeforeDiscount;
                    cover['ExchangeRate'] = sub?.ExchangeRate;
                    cover['PremiumExcluedTax'] = sub?.PremiumExcluedTax;
                    cover['PremiumIncludedTax'] = sub?.PremiumIncludedTax;
                    cover['Taxes'] = sub.Taxes;
                    cover['SubCoverId'] = sub.SubCoverId
                    sub['selected'] = true;
                  }
                  else{
                    sub['selected'] = false;
                  }
                }
                subCover['selected'] = true;
                let subIndex = sectionEntry.Covers.findIndex(ele=>ele.CoverId==cover.CoverId);
                sectionEntry.Covers[subIndex] = newEntry;
                if(vehicle?.totalPremium){
                  if(cover.Endorsements!=null){
                    vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
                    vehicle['totalPremium'] =  vehicle['totalPremium']+cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
                  }
                  else{
                    vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + subCover.PremiumIncludedTaxLC;
                    vehicle['totalPremium'] =  vehicle['totalPremium']+subCover.PremiumIncludedTax;
                  }
                }
                else{
                  if(cover.Endorsements!=null){
                    vehicle['totalLcPremium'] = cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
                    vehicle['totalPremium'] = cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
                  }
                  else{
                    vehicle['totalLcPremium'] =  cover.PremiumIncludedTax;
                    vehicle['totalPremium'] =  cover.PremiumIncludedTax;
                  }
                }
                console.log("Total Premium",cover,vehicle)
                this.getTotalVehiclesCost();
              
              
            }
           }
          }
        }
        else{
          let id=null;
            if(cover.VehicleId) id= cover.VehicleId; else id=vehicle.VehicleId
          let element = {
            "Covers": [{
                "CoverId": cover.CoverId,
                "SubCoverId": subCover.SubCoverId,
                "SubCoverYn": "Y"
              }],
            "LocationId": vehicle.LocationId,
            "Id": id,
            "SectionId": cover.SectionId
          }
          if((cover.PremiumIncludedTax!=null && cover.PremiumIncludedTax!='0' && cover.PremiumIncludedTax!=undefined)){
            vehicle['totalLcPremium'] = vehicle['totalLcPremium'] - cover.PremiumIncludedTax;
            vehicle['totalPremium'] =  vehicle['totalPremium'] - cover.PremiumIncludedTax; 
            cover.PremiumIncludedTax = 0;
            cover.PremiumIncludedTax=0;
          }
          cover.PremiumIncludedTax = subCover.PremiumIncludedTaxLC;
          cover.PremiumIncludedTax = subCover.PremiumIncludedTax;
          cover.selected = true;
          for(let sub of cover.SubCovers){
            if(sub.SubCoverId==subCover.SubCoverId){
              cover['isReferal'] = sub.isReferal;
              cover['SumInsured'] = sub.SumInsured;
              cover['Loadings'] = sub.Loadings;
              cover['PremiumAfterDiscount'] = sub.PremiumAfterDiscount;
              cover['MinimumPremium'] = sub.MinimumPremium;
              cover['MinimumPremiumYn'] = sub?.MinimumPremiumYn;
              cover['Discounts'] = sub?.Discounts;
              cover['CalcType'] = sub?.CalcType;
              cover['Rate'] = sub?.Rate;
              cover['ExcessPercent'] = sub?.ExcessPercent;
              cover['ExcessAmount'] = sub?.ExcessAmount;
              cover['PremiumBeforeDiscount'] = sub.PremiumBeforeDiscount;
              cover['ExchangeRate'] = sub?.ExchangeRate;
              cover['PremiumExcluedTax'] = sub?.PremiumExcluedTax;
              cover['PremiumIncludedTax'] = sub?.PremiumIncludedTax;
              cover['Taxes'] = sub.Taxes;
              cover['SubCoverId'] = sub.SubCoverId
              sub['selected'] = true;
            }
            else{
              sub['selected'] = false;
            }
          }
          subCover['selected'] = true;
          this.selectedCoverList.push(element);
          if(vehicle?.totalPremium){
            if(cover.Endorsements!=null){
              vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
              vehicle['totalPremium'] =  vehicle['totalPremium']+cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
            }
            else{
              vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + subCover.PremiumIncludedTax;
              vehicle['totalPremium'] =  vehicle['totalPremium']+subCover.PremiumIncludedTax;
            }
            
          }
          else{
            if(cover.Endorsements!=null){
              vehicle['totalLcPremium'] = cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
              vehicle['totalPremium'] = cover.Endorsements[cover.Endorsements.length-1].PremiumIncludedTax;
            }
            else{
              vehicle['totalLcPremium'] =  cover.PremiumIncludedTax;
              vehicle['totalPremium'] =  cover.PremiumIncludedTax;
            }
            
          }
          this.getTotalVehiclesCost();
        }
      }
    }
    getTotalVehiclesCost(){
      let totalCost = 0,i=0,totalLocalCost=0;
      for(let veh of this.vehicleDetailsList){
        if(veh?.totalPremium) totalCost = totalCost+veh?.totalPremium;console.log('Total1 premium',veh,totalCost,veh?.totalPremium);
        if(veh?.totalLcPremium) totalLocalCost = totalLocalCost+veh?.totalLcPremium; console.log('Total2 premium',veh,totalLocalCost,veh?.totalLcPremium);
        i+=1;
        if(i==this.vehicleDetailsList.length){
            this.localPremiumCost = totalLocalCost;
            this.totalPremium = totalCost;
            if(this.vehicleData[0].EmiYn!=null && this.vehicleData[0].EmiYn!=undefined && this.vehicleData[0].EmiYn!=''){
            this.emiYN = this.vehicleData[0].EmiYn;
            this.emiPeriod = this.vehicleData[0].InstallmentPeriod;
          }
          else if(!this.endorsementSection) {
            this.emiYN = "N";
            //this.EmiInstallment();
          }
        }
      }
    }
    canbeChecked(rowData){
      if(rowData?.selected!=undefined){
        return rowData.selected;
      }
      return false;
    }
    onSelectCover(rowData,event,vehicleId,vehicleData,type,directType){
      if(event==null){
        event = !this.canbeChecked(rowData);
      }
      //if(type=='coverList' && (rowData.SubCovers==null || (rowData.SubCovers!=null && rowData.SubCoverId!=null))){
        let vehicle:any;
          if(this.productId!='4' && this.productId!='5' && this.productId!='46' && this.productId!='29'){
            vehicle = this.vehicleDetailsList.find(ele=>(ele.LocationId==rowData.LocationId && ele.SectionId==rowData.SectionId));
            if(vehicle==undefined) vehicle = vehicleData
           
          }
          else{
            vehicle = this.vehicleDetailsList.find(ele=>ele.Vehicleid==vehicleId && ele.SectionId==rowData.SectionId && ele.LocationId==rowData.LocationId);
          }
          let coverList = vehicle?.CoverList;
          if(event){
            rowData.selected= true;
            if(rowData.DifferenceYN==undefined && this.coverModificationYN=='Y'){
              if(vehicle.Status=='D') rowData.DifferenceYN = 'N';
              else rowData.DifferenceYN = 'Y'
            }
            if(this.selectedCoverList.length!=0){
             
              let entry = this.selectedCoverList.filter(ele=>(ele.Id==vehicleId && (this.productId=='5' || this.productId=='46')) || (ele.LocationId==rowData.LocationId && (this.productId!='5' && this.productId!='46')) );
              if(entry.length==0){
                let id=null;
                if(rowData.RiskDetails?.RiskId) id= rowData.RiskDetails?.RiskId; else id=vehicleId
                if(rowData.SubCovers==null){
                  console.log("Error Vehicle",vehicle)
                  let element = {
                    "Covers": [
                      {
                        "CoverId": rowData.CoverId,
                        "SubCoverId": null,
                        "SubCoverYn": "N",
                        //"isReferal": rowData.isReferal
                      }
                    ],
                    "LocationId": rowData.LocationId,
                    "Id": id,
                    "SectionId": rowData.SectionId,
  
                  }
                  this.selectedCoverList.push(element);
                }
                
                
                if(directType=='change' && this.endorsementSection){
                  
                    vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + rowData.PremiumIncludedTax;
                    vehicle['totalPremium'] =  vehicle['totalPremium']+rowData.PremiumIncludedTax;
                  
                }
                else if(vehicle?.totalPremium){
                  console.log('Endorsemet section Values 2')
                  rowData['Modifiable']='N';
                 
                      vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + rowData.PremiumIncludedTax;
                      vehicle['totalPremium'] =  vehicle['totalPremium']+rowData.PremiumIncludedTax;
                
                  
                }
                else{
                  console.log('Endorsemet section Values3')
                  rowData['Modifiable']='N';
                  vehicle['totalLcPremium'] =  rowData.PremiumIncludedTax;
                  vehicle['totalPremium'] =  rowData.PremiumIncludedTax;
                  
                }
                  console.log("Total Premium",rowData,vehicle)
                this.getTotalVehiclesCost();
                //this.totalPremium = this.totalPremium+rowData.PremiumIncludedTax
              }
              else{
                console.log('Endorsemet section Values4');
               let sectionEntry = entry.find(ele=>ele.SectionId == rowData.SectionId);
              
               if(sectionEntry == undefined){
                if(rowData.SubCovers==null){
                  let id=null;
                  if(rowData.RiskDetails?.RiskId) id= rowData.RiskDetails?.RiskId; else id=vehicleId
                  let element = {
                    "Covers": [
                      {
                        "CoverId": rowData.CoverId,
                        "SubCoverId": null,
                        "SubCoverYn": "N",
                        //"isReferal": rowData.isReferal
                      }
                    ],
                    "LocationId": rowData.LocationId,
                    "Id": id,
                    "SectionId": rowData.SectionId,
  
                  }
                  this.selectedCoverList.push(element);
                  
                  console.log("Selected Cover Lists",this.selectedCoverList)
                }
                
                if(directType=='change' && this.endorsementSection){
                  
                  
                  if(this.coverModificationYN=='Y' && this.endorsementSection && vehicle?.totalPremium && rowData.Endorsements!=null){
                    if(rowData.Endorsements[rowData.Endorsements.length-1].PremiumIncludedTax<0){
                      vehicle['totalLcPremium'] = vehicle['totalLcPremium'] - rowData.Endorsements[rowData.Endorsements.length-1].PremiumIncludedTax;
                      vehicle['totalPremium'] =  vehicle['totalPremium']-rowData.Endorsements[rowData.Endorsements.length-1].PremiumIncludedTax;
                    }
                    else{
                      vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + rowData.Endorsements[rowData.Endorsements.length-1].PremiumIncludedTax;
                      vehicle['totalPremium'] =  vehicle['totalPremium']+rowData.Endorsements[rowData.Endorsements.length-1].PremiumIncludedTax;
                    }
                    
                  }
                  else if(vehicle?.totalPremium){
                    rowData['Modifiable']='N';
                    
                    if(rowData.Endorsements!=null && rowData.Endorsements!=undefined){
                      if(this.coverModificationYN!='Y'){
                        vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + rowData.Endorsements[rowData.Endorsements.length-1].PremiumIncludedTax;
                        vehicle['totalPremium'] =  vehicle['totalPremium']+rowData.Endorsements[rowData.Endorsements.length-1].PremiumIncludedTax;
                      }
                    }
                    else{
                        vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + rowData.PremiumIncludedTax;
                        vehicle['totalPremium'] =  vehicle['totalPremium']+rowData.PremiumIncludedTax;
                    }
                    
                  }
                  else{
                    rowData['Modifiable']='N';
                    vehicle['totalLcPremium'] =  rowData.PremiumIncludedTax;
                    vehicle['totalPremium'] =  rowData.PremiumIncludedTax;
                  }
                }
                else if(vehicle?.totalPremium){
                  rowData['Modifiable']='N';
                  vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + rowData.PremiumIncludedTax;
                  vehicle['totalPremium'] =  vehicle['totalPremium']+rowData.PremiumIncludedTax;
                }
                else{
                  rowData['Modifiable']='N';
                  vehicle['totalLcPremium'] =  rowData.PremiumIncludedTax;
                      vehicle['totalPremium'] =  rowData.PremiumIncludedTax;
                }
                  this.getTotalVehiclesCost();
               }
               else{
                  let covers:any[] = sectionEntry.Covers;
                let findCover = covers.filter(ele=>ele.CoverId==rowData.CoverId);
                if(findCover.length==0) {
                  if(rowData.SubCovers==null){
                    let element = {
                          "CoverId": rowData.CoverId,
                           "SubCoverId": null,
                           "SubCoverYn": "N",
                    }
                    sectionEntry.Covers.push(element)
                  }
                  if(directType=='change' && this.endorsementSection){
                    if(rowData.Endorsements!=null && rowData.Endorsements!=undefined){
                      if(this.coverModificationYN=='Y'){
                        if(rowData.Endorsements[rowData.Endorsements.length-1].PremiumIncludedTax<0){
                          vehicle['totalLcPremium'] = vehicle['totalLcPremium'] - rowData.Endorsements[rowData.Endorsements.length-1].PremiumIncludedTax;
                          vehicle['totalPremium'] =  vehicle['totalPremium']-rowData.Endorsements[rowData.Endorsements.length-1].PremiumIncludedTax;
                        }
                        else{
                          vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + rowData.Endorsements[rowData.Endorsements.length-1].PremiumIncludedTax;
                          vehicle['totalPremium'] =  vehicle['totalPremium']+rowData.Endorsements[rowData.Endorsements.length-1].PremiumIncludedTax;
                        }
                      }
                      else{
                        vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + rowData.Endorsements[rowData.Endorsements.length-1].PremiumIncludedTax;
                        vehicle['totalPremium'] =  vehicle['totalPremium']+rowData.Endorsements[rowData.Endorsements.length-1].PremiumIncludedTax;
                      }
                      
                    }
                    else{
                      console.log('JJJJJJJJJ',vehicle?.totalLcPremium,vehicle?.totalPremium);
                      if(!vehicle?.totalLcPremium) {vehicle['totalLcPremium'] = 0;}
                      if(!vehicle?.totalPremium){ vehicle['totalPremium'] = 0; }
                      console.log('If cover changes10',rowData,rowData.PremiumIncludedTax,rowData.PremiumIncludedTax);
                        vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + rowData.PremiumIncludedTax;
                        console.log('Total Premiums 111111111',vehicle?.totalPremium,rowData.PremiumIncludedTax);
                        vehicle['totalPremium'] =  vehicle['totalPremium'] + rowData.PremiumIncludedTax;
                        console.log('end', vehicle);
                    }
                  }
                  else if(vehicle?.totalPremium){
                   vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + rowData.PremiumIncludedTax;
                   vehicle['totalPremium'] =  vehicle['totalPremium']+rowData.PremiumIncludedTax;
                  }
                  else{
                    if(!vehicle?.totalLcPremium) {vehicle['totalLcPremium'] = 0;}
                      if(!vehicle?.totalPremium){ vehicle['totalPremium']=0;}
                        vehicle['totalLcPremium'] =  rowData.PremiumIncludedTax;
                        vehicle['totalPremium'] =  rowData.PremiumIncludedTax;
                    }
                  this.getTotalVehiclesCost();
                }
               }
              }
            }
            else{
              if(rowData.SubCovers==null){
                let id=null;
                if(rowData.VehicleId) id= rowData.VehicleId; else id=vehicleId
                let element = {
                  "Covers": [
                    {
                      "CoverId": rowData.CoverId,
                      "SubCoverId": null,
                      "SubCoverYn": "N"
                    }
                  ],
                  "LocationId": rowData.LocationId,
                  "Id": id,
                  "SectionId": rowData.SectionId,
  
                }
                this.selectedCoverList.push(element);
              }
              if(vehicle?.totalPremium){
                  vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + rowData.PremiumIncludedTax;
                  vehicle['totalPremium'] =  vehicle['totalPremium']+rowData.PremiumIncludedTax;
              }
              else{
                  vehicle['totalLcPremium'] =  rowData.PremiumIncludedTax;
                  vehicle['totalPremium'] =  rowData.PremiumIncludedTax;
              }
            this.getTotalVehiclesCost();
            }
          }
          else{
            rowData['selected']= false;
            let entry = this.selectedCoverList.filter(ele=>ele.Id==vehicleId);
            if(entry){
              let sectionEntry = entry.find(ele=>ele.SectionId==rowData.SectionId);
              if(sectionEntry!=undefined){
                let covers:any[] = sectionEntry.Covers;
                let CoverIndex = covers.findIndex(ele=>ele.CoverId==rowData.CoverId);
                covers.splice(CoverIndex,1);
                if(this.coverModificationYN=='Y') {rowData['DifferenceYN'] = 'N';}
                if(directType=='change' && this.endorsementSection){
                  if(!vehicle?.totalLcPremium) {vehicle['totalLcPremium'] = 0;}
                  if(!vehicle?.totalPremium) { vehicle['totalPremium'] = 0 ;}
                  if(rowData.Endorsements!=null && rowData.Endorsements!=undefined){
                      if(this.coverModificationYN=='Y'){
                        vehicle['totalLcPremium'] = vehicle['totalLcPremium'] + rowData.Endorsements[rowData.Endorsements.length-1].PremiumIncludedTax;
                        vehicle['totalPremium'] =  vehicle['totalPremium']+rowData.Endorsements[rowData.Endorsements.length-1].PremiumIncludedTax;
                      }
                      else{
                        vehicle['totalLcPremium'] = vehicle['totalLcPremium'] - rowData.Endorsements[rowData.Endorsements.length-1].PremiumIncludedTax;
                        vehicle['totalPremium'] =  vehicle['totalPremium']-rowData.Endorsements[rowData.Endorsements.length-1].PremiumIncludedTax;
                      }
                    }
                    else{
                      console.log('Minus premiums1',vehicle,vehicle?.totalPremium,rowData.PremiumIncludedTax)
                      vehicle['totalLcPremium'] = vehicle['totalLcPremium'] - rowData.PremiumIncludedTax;
                      vehicle['totalPremium'] =  vehicle['totalPremium'] - rowData.PremiumIncludedTax;
                    }
                  
                }
                else if(vehicle?.totalPremium){
                  if(rowData.Endorsements!=null && rowData.Endorsements!=undefined){
                    vehicle['totalLcPremium'] = vehicle['totalLcPremium'] - rowData.Endorsements[rowData.Endorsements.length-1].PremiumIncludedTax;
                    vehicle['totalPremium'] =  vehicle['totalPremium']-rowData.Endorsements[rowData.Endorsements.length-1].PremiumIncludedTax;
                  }
                  else{
                    console.log('Minus premiums2',vehicle,vehicle?.totalPremium,rowData.PremiumIncludedTax)
                    vehicle['totalLcPremium'] = vehicle['totalLcPremium'] - rowData.PremiumIncludedTax;
                    vehicle['totalPremium'] =  vehicle['totalPremium']-rowData.PremiumIncludedTax;
                  }
                
                }
                if(rowData.SubCovers){
                  rowData.SubCoverId=null;
                  for(let sub of rowData.SubCovers){
                    sub['selected'] = false;
                  }
                }
                this.getTotalVehiclesCost();
              }
            }
          }
      console.log("Final Covers",this.vehicleDetailsList,this.selectedCoverList)
    }
    getEditQuoteDetails(){
      let i = 0;
      for (let veh of this.vehicleDetailsList) {
        if (veh.VehicleId) veh['Vehicleid'] = veh.VehicleId
        if (i == 0) { //this.remarks = veh.AdminRemarks;
          this.rejectedReason = veh.RejectReason
        }
        let covers = veh.CoverList;
        let j = 0;
        for (let cover of covers) {

          let entry = this.vehicleDetailsList.find(ele => (String(ele.Vehicleid) == String(veh.VehicleId) && (this.productId == '5' || this.productId == '46') || ((this.productId != '5' && this.productId != '46' && String(ele.LocationId) == String(veh.LocationId)))))
          if (entry) {
            let coverList = entry.CoverList;
            if (cover.UserOpt == 'Y') {
              let coverEntry = coverList.find(ele => ele.CoverId == cover.CoverId)
              if (coverEntry) {
                if (this.endorsementId == 846 && veh.Status == 'D') {
                  cover['selected'] = false;
                  // this.onSelectCover(cover,true,veh.Vehicleid,veh,'coverList','direct');
                }
                else {
                  cover['selected'] = true;
                  this.onSelectCover(cover, true, cover.VehicleId, veh, 'coverList', 'direct');
                }
                console.log("Selected 2", cover);
              }
            }
            
          }
          j += 1;
          if (j == covers.length) i += 1;
        }

        if (i == this.vehicleDetailsList.length) {
          this.showSection = true;
          if (this.vehicleDetailsList.some(ele => ele.ManualReferalYn == 'Y') && !this.adminSection && this.statusValue) {
            this.isMannualReferal = "N";
          }
          this.selectedRowData = this.vehicleDetailsList[0];
          this.onSelectSection();
          this.coverSection = true;


          console.log("Final Vehicle Listaaaa", this.vehicleDetailsList, this.selectedCoverList)
        }
      }

    }
    onSelectSection(){
      console.log("Current Id",this.selectedRowData)
      if(this.selectedRowData!=null){
        this.coverSection = false;
        this.selectedVehicleList = [this.selectedRowData]
        this.coverSection = true;
  
      }
    }
    addOns = [
      { name: 'Passenger risk', price: 202 },
      { name: 'Material damage', price: 0 },
      { name: '24/7 Towing Services', price: 427 },
      { name: 'Trailer Extension', price: 503 },
      { name: 'Loss Of Use Spare Parts', price: 2012 },
      { name: 'Mo safer', price: 503 },
      { name: 'Passive Terrorism Inclusion Clause', price: 1007 },
      { name: 'Third Party Bodily Injury', price: 0 }
    ];

  
    onBuypolicy(){
      this.submit=true;
    }
    


    isPopupVisible: boolean = false;

    openPopup() {
      this.generateOtp()

      this.isPopupVisible = true;
    }
  
    // closePopup() {
    //   this.isPopupVisible = false;
    // }
    generateOtp() {
      alert()
      let searchValue = "";
      let mobileCode = ""; let mobileNumber = "";
      let token = sessionStorage.getItem('UserToken');
    
      if(this.MobileCode){
      let mobiledesc= this.mobileCodeList.filter(ele => ele.Code == this.MobileCode || ele.CodeDesc == String(this.MobileCode))
        if(mobiledesc){
          console.log("Final Code",mobiledesc,this.MobileCode,this.mobileCodeList)
          mobileCode="230";
          this.MobileCodeDesc = mobileCode;
        }
      }
      
    //  this.lastMobileNo = this.MobileNo.replace(/.(?=.{4})/g, 'x');
      let reqObj = {
        "CompanyId":this.insuranceId,
        "ProductId": this.productId,
        "LoginId": this.LoginId,
        "TemplateName":null,
        "OtpUser": {
          "UserMailId": this.EmailId,
          "UserMobileNo":this.MobileNo,
          "UserMobileCode":this.MobileCodeDesc,
          "UserWhatsappNo": this.MobileNo,
          "UserWhatsappCode": this.MobileCodeDesc,
          "CustomerName": this.ClientName
        }
      }
      let url = `${this.CommonApiUrl}otp/generate`;
      try {
    
        this.sharedService.onPostMethodSync(url, reqObj).subscribe((data: any) => {
        console.log("Otp Generate Res", data);
        if (data.Errors) {
          this.otpSection = false;
          this.otpGenerated = null;
          let element = '';
          for (let i = 0; i < data.Errors.length; i++) {
          element += '<div class="my-1"><i class="far fa-dot-circle text-danger p-1"></i>' + data.Errors[i].Message + "</div>";
          }
    
          // Swal.fire(
          // 'Please Fill Valid Value',
          // `${element}`,
          // 'error',
          // )
        }
        else {
    
           this.otpId = data.OtpToken;
           this.otpGenerated = data.OTP;
          this.otpSection = true;
          this.otppage=true;
          this.OtpBtnEnable = true;
          //this.onOtpValidate();
          this.setTimeInterval();
        }
        }, (err) => {
        console.log(err);
        })
       } catch (error) {
      }
    }
  MobileCode(arg0: string, mobiledesc: any, MobileCode: any, mobileCodeList: any) {
    throw new Error('Method not implemented.');
  }
    onOtpValidate() {
    
      if (this.otpValue == "" || this.otpValue == undefined || this.otpValue == null) {
        let element = '<div class="my-1"><i class="far fa-dot-circle text-danger p-1"></i>Please Enter OTP</div>';
        // Swal.fire(
        // 'Please Fill Valid Value',
        // `${element}`,
        // 'error',
        // )
      }
      else {
        //this.otpValue = this.otpGenerated.replace(/\D/g, '');
        let reqObj = {
          "CompanyId": this.insuranceId,
          "ProductId": this.productId,
          "AgencyCode": this.agencyCode,
          "OtpToken": this.otpId,
          "UserOTP": this.otpValue,
          "CreateUser": true,
          "CustomerId": this.customerReferenceNo,
          "ReferenceNo": sessionStorage.getItem('quoteReferenceNo') 
        }
        let url = `${this.CommonApiUrl}otp/validate`;
        try {
        this.sharedService.onPostMethodSync(url, reqObj).subscribe((data: any) => {
          console.log("Otp Generate", data);
          if (data) {
          if (data.Errors) {
            let element = '';
            for (let i = 0; i < data.Errors.length; i++) {
            element += '<div class="my-1"><i class="far fa-dot-circle text-danger p-1"></i>' + data.Errors[i].Message + "</div>";
            }
    
            // Swal.fire(
            // 'Please Fill Valid Value',
            // `${element}`,
            // 'error',
            // )
          }
          else {
            this.otpId = "";
            this.otpValue = "";
            let loginId=this.MobileCodeDesc+this.MobileNo;
            this.LoginId = loginId;
            const Token = data?.LoginResponse?.Result?.Token;
            this.authService.login(data.LoginResponse);
            this.authService.UserToken(Token);
            data.LoginResponse.Result['LoginType'] = 'B2CFlow';
            sessionStorage.setItem('Userdetails', JSON.stringify(data.LoginResponse));
            sessionStorage.setItem('UserToken', Token);
            sessionStorage.setItem('menuSection', 'navMenu');
            sessionStorage.removeItem('b2cType')
            let userDetails = JSON.parse(sessionStorage.getItem('Userdetails') as any);
            userDetails.Result['ProductId'] = this.productId;
            userDetails.Result['ProductName'] = this.userDetails.Result.ProductName;
            userDetails.Result['BrokerBranchCode'] = this.brokerbranchCode;
            userDetails.Result['BranchCode'] = this.branchCode;
            userDetails.Result['CurrencyId'] = this.userDetails.Result.CurrencyId;
            userDetails.Result['InsuranceId'] = this.insuranceId;
            sessionStorage.setItem('Userdetails', JSON.stringify(userDetails));
            sessionStorage.setItem('resetLoginDetails','true');
            this.onFormSubmit();
            //this.onGuestLogin()
          }
          }
        }, (err) => {
        })
        } catch (error) {
        }
      }
    }
    setTimeInterval() {
    
      var count = 15,
        timer = setInterval(() => {
          var seconds = (count--) - 1;
          var percent_complete = (seconds / 60) * 100;
          percent_complete = Math.floor(percent_complete);
    
          this.OtpBtnTime = count;
          if (seconds == 0) {
            clearInterval(timer);
            this.OtpBtnEnable = false;
            this.OtpBtnTime = '';
          }
        }, 1000);
      }
    
      // onVerifyClick(){
      //   // Navigate to customer-detapdfpage component
      //   this.router.navigate(['/customer-detapdfpage']);
      // }
  
  
  
    onFormSubmit(){
      console.log("Selected Covers",this.selectedCoverList,this.loginType);
      //if(this.TotalCost!=0 && this.TotalCost!='' && this.TotalCost!=null){
        
      if(this.loginType){
        if(this.loginType=='B2CFlow' && this.LoginId =='guest'){
          this.customerReferenceNo = null;
          let customerObj = JSON.parse(sessionStorage.getItem('b2cCustomerObj'));
            //this.customerObj = this.customerDetails
            this.customerReferenceNo = sessionStorage.getItem('customerReferenceNo');
            this.generateOtp();
          //this.onCustomerSave(customerObj);
        }
        else this.onProceed(this.selectedCoverList);
      }
      else{
        console.log("Selected Covers",this.selectedCoverList);
        this.onProceed(this.selectedCoverList);
      }
    }
   
  
  
  
  
  finalFormSubmit(ReqObj){
    let urlLink = `${this.CommonApiUrl}quote/buypolicy`;
    this.sharedService.onPostMethodSync(urlLink, ReqObj).subscribe(
      (data: any) => {
          if(data.Result){
            if(data.Result.Status=='RP'){
              //this.referralSection = true;
              //this.Name = "Quote Details";
            }
            else if(data?.Result.QuoteNo){
              this.quoteNo = data.Result?.QuoteNo;
              sessionStorage.setItem('quoteNo',data.Result?.QuoteNo);
              this.otppage = false;
                {
                  this.getEditQuoteDetails();
              }
              //sessionStorage.setItem('quoteReferenceNo',data.Result?.RequestReferenceNo);
            }
          
          }
        },
        (err) => {
        
         },
      );
  }
  
  onProceed(coverList:any){
    
    let ReqObj:any ={},createdBy = "";let reqno
    let quoteStatus = sessionStorage.getItem('QuoteStatus');
      if(quoteStatus=='AdminRP'){
          createdBy = this.vehicleDetailsList[0].CreatedBy;
      }
      else{
        createdBy = this.LoginId;
      }
      let reqrefno = sessionStorage.getItem('quoteReferenceNo');
      console.log('Request Reference No',reqrefno);
      if(reqrefno!=null){
        reqno=reqrefno;
      }
      else{
        reqno=null;
      }

     ReqObj = {
        "RequestReferenceNo":reqno,
        "CreatedBy": createdBy,
        "ProductId": this.productId,
        "ManualReferralYn": "N",
        "ReferralRemarks": null,
        "Vehicles" : coverList
      }
      if(coverList){
        let i=0;
        console.log('coverList',coverList);
        for(let v of coverList){
            let coverrole=v.Covers;
            if(this.Accessum==0 || this.Accessum=='' || this.Accessum=='0' || this.Accessum==null){
              coverrole = coverrole.filter(ele=>ele.CoverId!='55');
            }
            let covers= coverrole.find(ele => ele.CoverId=='55');
            if(covers){
              this.finalFormSubmit(ReqObj); 
            }
            else{
              this.finalFormSubmit(ReqObj); 
            }
            i+=1;
        }
        //let covers= coverList.filter(ele => ele.Covers.CoverId=='55')
      }
        
}
onVerifyClick(){
//   // Navigate to customer-detapdfpage component
  this.router.navigate(['/customer-detapdfpage']);
}
}



// const otpData ={otp: this.otp};
// this.http
// .post( 'http://192.168.1.42:8086/otp/generate/',otpData)
// .subscribe((response:any) =>{
//   if(response.success){
//     this. verificationResult = 'OTP verified successfully'
//   }
// }
// )







// function onVerifyClick() {
//   throw new Error('Function not implemented.');
// }
// function redirectToCustomerdetapdfpage() {
//   throw new Error('Function not implemented.');
// }

// function onVerifyClick() {
//   throw new Error('Function not implemented.');
// }
// function redirectToCarCustomerDetails() {
//   throw new Error('Function not implemented.');
// }

