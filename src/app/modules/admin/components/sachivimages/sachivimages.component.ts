import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { SachiveImagesService } from '../../services/sachive-images.service';
import Util from '../../utils/utils';
import { PaginationComponent } from '../pagination/pagination.component';
import { SortingTableComponent } from '../sorting-table/sorting-table.component';
@Component({
  selector: 'app-sachivimages',
  standalone: true,
  imports: [RouterLink, PaginationComponent, SortingTableComponent, FormsModule],
  templateUrl: './sachivimages.component.html',
  styleUrl: './sachivimages.component.css'
})
export class SachivimagesComponent {

  currentPage: number = 1;
  searchValue: string = '';
  items: any = [];
  totalItems: number = 0;
  itemsPerPage: number = ITEM_PER_PAGE
  displayedColumns: any = [
    { key: 'sr_no', label: 'अनुक्रमांक' },
    { key: 'DISTRICT_NAME', label: 'जिल्हा' },
    { key: 'TALUKA_NAME', label: 'तालुका' },
    { key: 'PANCHAYAT_NAME', label: 'ग्राम पंचायत' },
    { key: 'FILE_NAME', label: 'सचिव नाव' },
  ];

  keyName: string = 'UPLOAD_ID';
  marathiText: string = '';
  talukaList: any = [];
  districtList: any = [];
  panchayatList: any = [];
  sachiveData: any = [];
  constructor(private titleService: Title, private sachive: SachiveImagesService, private util: Util, private toast: ToastrService, private router: Router) { }
  ngOnInit(): void {
    this.titleService.setTitle('Sachiv Images List');

    this.fetchDataSachiveData();
  }


  fetchDataSachiveData() {
    this.sachive.fetchSachiveImagesList({ page_number: this.currentPage, search_text: this.searchValue }).subscribe({
      next: (res: any) => {
        this.items = res?.data ?? [];
        this.totalItems = res?.totalRecords;
      },
      error: (err: any) => {
        console.error('Error get TaxList Data:', err);
      }
    });

  }

  async fetchTaluka() {
    this.talukaList = await this.util.getTalukaById([]);
  }

  fetchDistrict() {
    this.util.getDistrictDDL().then((observable) => {
      observable.subscribe({
        next: (res: any) => {
          this.districtList = res?.data ?? [];

        },
        error: (err: any) => {
          console.error('Error get TaxList Data:', err);
        }
      });
    });
  }




  async fetchPanchayat() {
    this.panchayatList = await this.util.getGatGramTalukaById([]);

  }

  getInfo(id: number) {

  }


  editInfo(id: number) {

    this.router.navigate(['admin/add-new-sachiv-images/', id]);
  }

  deleteInfo(id: number) {
    this.util.showConfirmAlert().then((res) => {
      if (!id) {
        this.toast.warning("Gat Sachive Id is required", "Warning!");
        return
      }
      if (res) {
        this.sachive.deleteSachiveImagesById(id).subscribe({
          next: (res: any) => {
            this.toast.success('Record deleted successfully', "Success!");
            this.fetchDataSachiveData();
          },
          error: (err: any) => {
            this.toast.error('Record delete failed', "Failed!");
            console.error('Error get TaxList Data:', err);
          }
        });
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchDataSachiveData();
  }

  translateText(event: Event) {
    this.util.getTranslateText(event, this.marathiText).subscribe({
      next: (translatedText: string) => {
        this.marathiText = translatedText;
      },
      error: (error: any) => {
        console.error('Error translating text:', error);
      },
    });
  }

  filterData() {

    this.currentPage = 1;
    this.debounceFetchData();

  }

  private debounceFetchData = this.debounce(() => {
    this.fetchDataSachiveData();
  }, 1000);

  private debounce(func: Function, wait: number) {
    let timeout: any;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    };
  }

  resetFilter(event: Event) {
    this.searchValue = '';
		this.fetchDataSachiveData();
  }

}