import { Component, EventEmitter, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ICreateDrugUsage, IUpdateDrugUsage } from '../../../../core/model/drug_usage';
import { DrugUsageService } from '../../servies/drug-usage.service';

@Component({
  selector: 'app-modal-drug-usage-new',
  templateUrl: './modal-drug-usage-new.component.html',
  styleUrls: ['./modal-drug-usage-new.component.css']
})
export class ModalDrugUsageNewComponent {

  validateForm!: UntypedFormGroup

  @Output() onSubmit = new EventEmitter<any>()

  isOkLoading = false
  isVisible = false
  code: any = ''

  constructor (
    private fb: UntypedFormBuilder,
    private message: NzMessageService,
    private drugService: DrugUsageService,
  ) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      code: [null, [Validators.required]],
    })
  }

  showModal(code: any = '', name: any = ''): void {

    this.validateForm.reset()
    this.validateForm.controls['code'].enable()
    if (code) {
      this.code = code
      this.validateForm.patchValue({
        name: name,
        code: code
      })
      this.validateForm.controls['code'].disable()
    }

    this.isVisible = true
  }

  async doRegister(drug: ICreateDrugUsage) {
    this.isOkLoading = true
    const messageId = this.message.loading('กำลังบันทึกข้อมูล...', { nzDuration: 0 }).messageId
    try {
      await this.drugService.save(drug)
      this.message.remove(messageId)
      this.isOkLoading = false
      this.isVisible = false
      this.onSubmit.emit(true)
    } catch (error: any) {
      this.isOkLoading = false
      this.message.remove(messageId)
      this.message.error(`${error.code} - ${error.message}`)
    }
  }

  async doUpdate(drug: IUpdateDrugUsage) {
    this.isOkLoading = true
    const messageId = this.message.loading('กำลังบันทึกข้อมูล...', { nzDuration: 0 }).messageId
    try {
      await this.drugService.update(this.code, drug)
      this.message.remove(messageId)
      this.isOkLoading = false
      this.isVisible = false
      this.onSubmit.emit(true);
    } catch (error: any) {
      this.isOkLoading = false
      this.message.remove(messageId);
      this.message.error(`${error.code} - ${error.message}`);
    }
  }

  handleOk(): void {
    if (this.validateForm.valid) {
      if (this.code) {
        let drug: IUpdateDrugUsage = {
          usage1: this.validateForm.value.usage1,
          usage2: this.validateForm.value.usage2,
          usage3: this.validateForm.value.usage3
        }

        this.doUpdate(drug)

      } else {
        let drug: ICreateDrugUsage = {
          code: this.validateForm.value.code,
          usage1: this.validateForm.value.usage1,
          usage2: this.validateForm.value.usage2,
          usage3: this.validateForm.value.usage3
        }

        this.doRegister(drug)

      }
      return
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty()
          control.updateValueAndValidity({ onlySelf: true })
        }
      });
      return
    }
  }

  handleCancel(): void {
    this.validateForm.reset()
    this.isOkLoading = false
    this.isVisible = false
  }

}
