import { AuthData } from './auth-data.model';
import { User } from './user.model';
import {Subject} from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { TrainingService } from '../training/training.service';

@Injectable()
export class AuthService {
    private user: User;
    authChange = new Subject<boolean>();
    private isAuthenticated = false;

    constructor(private router: Router, private afAuth: AngularFireAuth, private trainingService: TrainingService) {}

    initAuthListener() {
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.isAuthenticated = true;
                this.authChange.next(true);
                this.router.navigate(['/training']);
            }
            else {
                this.trainingService.cancelSubscriptions();
                this.isAuthenticated = false;
                this.user = null;
                this.authChange.next(false);
                this.router.navigate(['/login']);
            }
        });
    }

    registerUser(authData: AuthData) {
        this.afAuth.createUserWithEmailAndPassword(authData.email, authData.password).then(result => {
            console.log(result);
        })
        .catch(error => {
            console.log(error);
        });
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/login']);
    }

    login(authData: AuthData) {
        this.afAuth.signInWithEmailAndPassword(authData.email, authData.password).then(result => {
            console.log(result);
        })
        .catch(error => {
            console.log(error);
        });
        this.authChange.next(true);
        this.router.navigate(['/training']);
    }

    logout() {
        this.afAuth.signOut();
    }

    isAuth() {
        return this.isAuthenticated;
    }
}