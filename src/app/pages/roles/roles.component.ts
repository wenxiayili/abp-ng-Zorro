import { Component, Injector, ViewChild } from '@angular/core';
import { ModalHelper } from '@shared/helpers/modal.helper';
import { PagedListingComponentBase, PagedRequestDto } from "shared/component-base";
import { RoleServiceProxy, RoleDto, PagedResultDtoOfRoleDto } from "shared/service-proxies/service-proxies";

import { CreateRoleComponent } from "./create-role/create-role.component";
import { EditRoleComponent } from "./edit-role/edit-role.component";

import { NzModalService } from 'ng-zorro-antd';

@Component({
	selector: 'pro-page-roles',
	templateUrl: './roles.component.html',
	styleUrls: ['./roles.component.less']
})
export class RolesComponent extends PagedListingComponentBase<RoleDto> {

	dataItems: RoleDto[] = [];

	constructor(
		private injector: Injector,
		private roleService: RoleServiceProxy,
		private modalHelper: ModalHelper,
		private modalService: NzModalService
	) {
		super(injector);
	}

	list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
		this.roleService.getAll(request.skipCount, request.maxResultCount)
			.finally(() => {
				finishedCallback();
			})
			.subscribe((result: PagedResultDtoOfRoleDto) => {
				this.dataItems = result.items;
				this.showPaging(result, pageNumber);
			});
	}

	delete(role: RoleDto): void {
		this.message.confirm(
			"Remove Users from Role and delete Role '" + role.displayName + "'?",
			"Permanently delete this Role",
			(result: boolean) => {
				if (result) {
					this.roleService.delete(role.id)
						.finally(() => {
							abp.notify.info("Deleted Role: " + role.displayName);
							this.refresh();
						})
						.subscribe(() => { });
				}
			}
		);
	}

	// Show Modals
	create(): void {
		this.modalHelper.open(CreateRoleComponent).subscribe(res => this.refresh());
	}

	edit(role: RoleDto): void {
		this.modalHelper.open(EditRoleComponent, { id: role.id }).subscribe(res => 
			{
				this.refresh()
				console.log('refresh list')
			}
		);
	}
}
