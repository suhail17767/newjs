import { LightningElement , wire , track} from 'lwc';
import getbook from '@salesforce/apex/library.getbook';
import issuebook from  '@salesforce/apex/library.issuebook';
import getBookListByname from '@salesforce/apex/library.getBookListByname'; 
import totalbooks from '@salesforce/apex/library.totalbooks';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
export default class Searchbook extends LightningElement {
  
    @track columns = [
        { label: 'Id', fieldName: 'Name' },
        { label: 'Book Name', fieldName: 'Book_Name__c'} ,
        { label: 'Book Status', fieldName: 'Book_Status__c'} ,
        { label: 'Return Date', fieldName: 'Return_Date__c'}
     ];

    @track BookList;

    @track lstSelectedLeads;
    @track m;



    searchType = 'Name'
    searchKey = ''
    searchValue = '' //passing value to button on click
    visibleContacts //pagination
    totalContacts //pagination
    

  @track BookList;
 
     @wire(getbook) wiredBooks({data,error}){
        if (data) {
             this.BookList = data;
        console.log(data); 
        } else if (error) {
        console.log(error);
        }
   }
  
   @track l1;
   
   getSelectedRec() {

    var selectedRecords = this.template.querySelector("lightning-datatable").getSelectedRows();  
  
    if(selectedRecords.length != 0)
{
    console.log('selectedRecords are ',selectedRecords);
    this.lstSelectedLeads = selectedRecords;
    totalbooks().then(result=> {
    
        if( ( this.l1 = result.length ) < 3  )
       {
         issuebook({ obj : this.lstSelectedLeads }).
             then(result=> {this.m = result; 
             }).
             catch(error=>{this.b=error;  })
     
             alert("Success");
             return refreshApex(this.refrextable); 
        }
        
    
    else
        {
            alert("Limit Reached");
        }
        
        
        
    }).
    catch(error=>{this.b=error;  })
    var e2 = this.template.querySelector('lightning-datatable');
    selectedRecords=e2.selectedRows=e2.selectedRows.slice(selectedRecords.length);
}
else
{
    alert("Please Select")
}
                  
 
}











handleRowSelection = event => {
    var selectedRows=event.detail.selectedRows;
    for (let i = 0; i < selectedRows.length; i++)
   { 
    if(selectedRows[i].Book_Status__c == 'Borrowed')
    {
      var e2 = this.template.querySelector('lightning-datatable');
      selectedRows=e2.selectedRows=e2.selectedRows.slice(selectedRows.length);
      this.showNotification1();
      event.preventDefault();
      return;
    }
   }
    
   if( selectedRows.length >= 1  )
   {
       totalbooks().then(result=> {
   
           if( ( selectedRows.length + result.length ) > 3  )
          {
           
           var el = this.template.querySelector('lightning-datatable');
           selectedRows=el.selectedRows=el.selectedRows.slice(1);
           this.showNotification2();
           event.preventDefault();
           return;
   
           }
    
    })

   }

    if(selectedRows.length> 3)
    {
        var el = this.template.querySelector('lightning-datatable');
        selectedRows=el.selectedRows=el.selectedRows.slice(3);
        this.showNotification();
        event.preventDefault();
        return;
    }
     
    
    
    

}

  showNotification() {
    const event = new ShowToastEvent({
        title: 'Error',
        message: 'Only 3 Books Can be Issued at One Time',
        variant: 'warning',
        mode: 'pester'
    });
    this.dispatchEvent(event);
}

showNotification1() {
    const event1 = new ShowToastEvent({
        title: 'Error',
        message: 'Book Already Borrowed',
        variant: 'warning',
        mode: 'pester'
    });
    this.dispatchEvent(event1);
}

showNotification2() {
    const event1 = new ShowToastEvent({
        title: 'Error',
        message: 'Overall 3 Book are Allowed',
        variant: 'warning',
        mode: 'pester'
    });
    this.dispatchEvent(event1);
}


 







  


    
  
     
    @wire(getBookListByname, { param: '$searchType', type: '$searchKey' })

    wiredContact(value) { //pagination
        this.refrextable = value;
       const { error, data } = value;
        if (data) {
            this.totalContacts = data
            console.log(this.totalContacts)
        }
        if (error) {
            console.error(error)
        }
    }



    updateContactHandler(event) { //pagination
        this.visibleContacts = [...event.detail.records];
        console.log(event.detail.records);
    }


    handleData(response) {
        this.accounts = response.data ;

    }



    getSearchValue(event) { 
           this.searchValue = event.target.value;

    }

    handleSearchKeyChange(event) {

        this.searchKey = this.searchValue; 
     
      }

    byName(event) 
    { 

        this.searchType = 'Name';

    }
    byid(event) { //to pass value from input to button

        this.searchType = 'id';

    }
    byCategory(event) { //to pass value from input to button

        this.searchType = 'Category';

    }
    byAuthor(event) { //to pass value from input to button

        this.searchType = 'Author';

    }

    connectedCallback()
    {
        return refreshApex(this.refrextable);
    }

    renderedCallback()

    {

        return refreshApex(this.refrextable); 

    }






}





















 
