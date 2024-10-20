import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { GramPanchayatService } from '../../services/gram-panchayat.service';
import Util from '../../utils/utils';
import { PaginationComponent } from "../pagination/pagination.component";

@Component({
    selector: 'app-grampanchayat',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, PaginationComponent],
    templateUrl: './grampanchayat.component.html',
    styleUrl: './grampanchayat.component.css'
})
export class GrampanchayatComponent implements OnInit, AfterViewInit {
    gramFrom = new FormGroup({
        districtName: new FormControl<string | null>(null),
        talukaName: new FormControl<string | null>(null),
        gramPanchayatName: new FormControl<string | null>(null),
    });
    isSubmitted: boolean = false;
    private currentPage: number = 1;
    districts: any = [];
    talukas: any = [];
    isEdit: boolean = false;
    private gramPanchaytData: any = [];
    itemsPerPage: number = ITEM_PER_PAGE;
    totalItems: number = 0;
    searchValue: string = '';
    panchayatId: number = 0;
    marathiText: string = '';
    constructor(private titleService: Title, private util: Util, private gramPanchayt: GramPanchayatService, private toastr: ToastrService) {
        this.titleService.setTitle('Gram Panchayat');
    }
    ngOnInit(): void {

        this.fetchGramPanchayatData();
        this.getAllDistricts();
    }
    ngAfterViewInit(): void {
        $('.my-select2').select2();

        $('#mySelect').on('change', (event) => {
            const selectedValue: string = String($(event.target).val());
            this.getTalukaByDistrict(selectedValue);
            if (selectedValue) {
                this.gramFrom.get('districtName')?.setValue(selectedValue || '');
            }
        });

        $('#taluka').on('change', (event) => {
            const selectedValue: string = String($(event.target).val());
            if (selectedValue) {
                this.gramFrom.get('talukaName')?.setValue(selectedValue || '');
            }
        });

    }

    fetchGramPanchayatData() {
        this.gramPanchayt.getGramPanchayatList({ page_number: this.currentPage, search_text: this.searchValue }).subscribe((res: any) => {
            this.gramPanchaytData = res.data ?? [];
            this.totalItems = res.totalRecords;
        });
    }
    get paginatedItems() {
        return this.gramPanchaytData;
    }
    async getAllDistricts() {
        this.districts = await this.util.getDistrictDDL();
    }

    getTalukaByDistrict(id: any) {

        this.gramPanchayt.getTalukaById({ id: id }).subscribe((res: any) => {
            this.talukas = res.data ?? [];
        });

    }

    keyDownText(event: KeyboardEvent, controlName: string): void {
        this.util.onKeydown(event, controlName, this.gramFrom);
    }

    addGramPanyachayt() {
        this.isSubmitted = true;
        console.log(this.gramFrom.value);
        if (this.gramFrom.valid && this.gramFrom.value.districtName && this.gramFrom.value.talukaName && this.gramFrom.value.gramPanchayatName) {
            let params: any = {
                district_id: this.gramFrom.value.districtName,
                taluka_id: this.gramFrom.value.talukaName,
                name: this.gramFrom.value.gramPanchayatName
            }
            this.gramPanchayt.createGramPanchayat(params).subscribe((res: any) => {
                if (res.status == 201) {
                    this.toastr.success(res.message);
                    this.gramFrom.reset();
                    this.isSubmitted = false;
                } else {
                    this.toastr.error(res.message);
                }
            });
        } else {
            this.toastr.error('Please fill all the fields');
        }
    }

    reset() {
        this.gramFrom.reset();
        this.isEdit = false;
    }

    srNo(index: number): number {
        return (this.currentPage - 1) * ITEM_PER_PAGE + index + 1;
    }

    onPageChange(page: number): void {
        this.currentPage = page;
        this.fetchGramPanchayatData();

    }
    editInfo(id: number) {
        this.gramPanchayt.getGramPanchayatById(id).subscribe((res: any) => {
            this.panchayatId = id;
            this.isEdit = true;
            if (res.status == 200) {
                this.gramFrom.get('districtName')?.setValue(res.data.DISTRICT_ID);
                $("#mySelect").val(res.data.DISTRICT_ID).trigger('change');
                this.gramFrom.get('talukaName')?.setValue(res.data.TALUKA_ID);
                this.gramFrom.get('gramPanchayatName')?.setValue(res.data.PANCHAYAT_NAME);

            } else {
                this.toastr.error(res.message);
            }

        });
    }

    updateGramPanchayat() {
        this.isSubmitted = true;
        if (this.gramFrom.valid && this.gramFrom.value.districtName && this.gramFrom.value.talukaName && this.gramFrom.value.gramPanchayatName) {
            let params: any = {
                district_id: this.gramFrom.value.districtName,
                taluka_id: this.gramFrom.value.talukaName,
                name: this.gramFrom.value.gramPanchayatName,
                grampanchayat_id: this.panchayatId
            }
            this.gramPanchayt.updateGramPanchayat(params).subscribe({
                next: (res: any) => {
                    if (res.status == 200) {
                        this.reset();
                        this.isSubmitted = false;
                        this.toastr.success(res?.message, 'Success');
                        this.fetchGramPanchayatData();
                    } else {
                        this.toastr.warning(res?.message, 'Success');
                    }
                },
                error: (err: Error) => {
                    console.error('Error updating Gram Panchayat:', err);
                    this.toastr.error('There was an error updating the Gram Panchayat.', 'Error');
                }
            });
        } else {
            this.toastr.error('Please fill all the fields');
        }

    }


    deleteGramPanchayat(id: number) {
        this.util.showConfirmAlert().then((res) => {
            if (id === 0) {
                this.toastr.error('This taluka cannot be deleted.', 'Error');
                return;
            }
            if (res) {
                this.gramPanchayt.deleteGramPanchayat(id).subscribe({
                    next: (res: any) => {
                        if (res.status == 200) {
                            this.toastr.success(res.message, "success");
                            this.fetchGramPanchayatData();
                        } else {
                            this.toastr.error(res.message, "error");
                        }
                    },
                    error: (err: Error) => {
                        console.error('Error deleting Gram Panchayat:', err);
                        this.toastr.error('There was an error deleting the Gram Panchayat.', 'Error');
                    }
                });
            }
        });
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
        this.debounceFetchDistrictData();
        
    }

    private debounceFetchDistrictData = this.debounce(() => {
        this.fetchGramPanchayatData();
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
        this.fetchGramPanchayatData();
    }
}
