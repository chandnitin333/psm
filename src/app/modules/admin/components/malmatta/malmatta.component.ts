import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { MalamataPrakarService } from '../../services/malamata-prakar.service';
import Util from '../../utils/utils';
import { PaginationComponent } from '../pagination/pagination.component';
import { SortingTableComponent } from '../sorting-table/sorting-table.component';

@Component({
  selector: 'app-malmatta',
  standalone: true,
  imports: [PaginationComponent, SortingTableComponent, FormsModule],
  templateUrl: './malmatta.component.html',
  styleUrl: './malmatta.component.css'
})
export class MalmattaComponent {
  currentPage: number = 1;
  searchValue: string = '';
  items: any = [];
  totalItems: number = 0;
  itemsPerPage: number = ITEM_PER_PAGE
  displayedColumns: any = [
    { key: 'sr_no', label: 'अनुक्रमांक' },
    { key: 'MILKAT_VAPAR_NAME', label: 'मालमत्तेचे वर्णन' },
    { key: 'MILKAT_NAME', label: 'मिलकत' }
  ];

  keyName: string = 'MILKAT_ID';
  marathiText: string = '';
  constructor(private titleService: Title, private milkatPrakar: MalamataPrakarService, private util: Util) { }

  ngOnInit(): void {
    this.titleService.setTitle('Malmatta');
    this.fetchData();
  }

  fetchData() {
    this.milkatPrakar.getMilkatPrakar({ page_number: this.currentPage, search_text: this.searchValue }).subscribe({
      next: (res: any) => {
        console.log("res===", res)
        this.items = res?.data ?? [];
        this.totalItems = res?.totalRecords;
      },
      error: (err: any) => {
        console.error('Error get Milkat Vapar List Data:', err);
      }
    });
  }

  editInfo(id: number) {

  }

  deleteInfo(id: number) {

  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchData();
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

  }

  resetFilter(event: Event) {

  }
}
