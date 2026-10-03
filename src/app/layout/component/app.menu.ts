import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '../../core/services/auth.service';
import type { UserRole } from '../../core/models/user.models';

// Item de menú con roles permitidos; si no se define, es visible para cualquier usuario autenticado.
type AppMenuItem = MenuItem & { roles?: UserRole[]; items?: AppMenuItem[] };

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of visibleModel(); track item.label) {
            @if (!item.separator) {
                <li app-menuitem [item]="item" [root]="true"></li>
            } @else {
                <li class="menu-separator"></li>
            }
        }
    </ul> `,
})
export class AppMenu implements OnInit {
    private readonly authService = inject(AuthService);

    model: AppMenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Inicio',
                items: [{ label: 'Dashboard', icon: 'pi pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Administración',
                roles: ['ADMIN'],
                items: [
                    {
                        label: 'Usuarios',
                        icon: 'pi pi-users',
                        routerLink: ['/users'],
                    },
                ],
            },
            {
                label: 'Herramientas',
                items: [
                    {
                        label: 'Herramientas',
                        icon: 'pi pi-wrench',
                        routerLink: ['/herramientas'],
                    },
                    {
                        label: 'Préstamos',
                        icon: 'pi pi-arrow-right-arrow-left',
                        routerLink: ['/prestamos'],
                    },
                ],
            },
        ];

        // Si aún no tenemos el rol en cache, lo pedimos para poder filtrar el menú.
        if (!this.authService.currentUser()) {
            this.authService.me().subscribe();
        }
    }

    // Filtra secciones cuyo rol no coincide con el del usuario autenticado.
    visibleModel(): AppMenuItem[] {
        const role = this.authService.currentUser()?.role;

        return this.model.filter((item) => !item.roles || (role && item.roles.includes(role)));
    }
}

