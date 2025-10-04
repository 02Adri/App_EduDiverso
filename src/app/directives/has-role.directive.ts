import { Directive, Input, TemplateRef, ViewContainerRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../service/user.service';
import { Role } from '../models/library.models';

@Directive({
  selector: '[hasRole]',
  standalone: true,
})
export class HasRoleDirective implements OnDestroy {
  private roles: Role[] = [];
  private sub?: Subscription;

  constructor(
    private tpl: TemplateRef<any>,
    private vcr: ViewContainerRef,
    private userService: UserService
  ) {
    // suscribirse a cambios del usuario
    this.sub = this.userService.userChanges().subscribe(() => this.update());
  }

  @Input()
  set hasRole(value: Role | Role[] | undefined) {
    if (!value) {
      this.roles = [];
      this.vcr.clear();
      return;
    }
    this.roles = Array.isArray(value) ? value : [value];
    this.update();
  }

  private update() {
    const role = this.userService.getRole();
    if (this.roles.includes(role as Role)) {
      this.vcr.clear();
      this.vcr.createEmbeddedView(this.tpl);
    } else {
      this.vcr.clear();
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
