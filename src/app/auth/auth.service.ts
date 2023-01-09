import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { User } from "./user.model";
import { Router, RouterModule } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

    private user!: User | null;
    authChange = new Subject<boolean>();

    constructor(private router: Router) {}

    registerUser(authData: AuthData): void {
        this.user = {
            email: authData.email,
            userId: Math.round(Math.random() * 10000).toString()
        }
        this.authSuccessfully()
    }

    login(authData: AuthData): void {
        this.user = {
            email: authData.email,
            userId: Math.round(Math.random() * 10000).toString()
        }
        this.authSuccessfully()
    }

    logout(): void {
        this.user = null
        this.authChange.next(false)
        this.router.navigate(['/login']);
    }

    getUSer(): User | undefined {
        if (this.user) {
            return { ...this.user }
        }
        return undefined
    }

    isAuth() {
        return this.user != null
    }

    private authSuccessfully(): void {
        this.authChange.next(true);
        this.router.navigate(['/training']);
    }
}