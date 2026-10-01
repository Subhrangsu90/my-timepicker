# Angular Material Timepicker Monorepo

Enterprise-grade **Material Design 3 (M3) Time Picker** for Angular 18+, featuring clock dials, numeric inputs, Angular Signal Forms support, and professional Sass theming.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## 📁 Repository Structure

```
my-timepicker/
├── projects/
│   ├── ngx-mat-timepicker/    # The core Angular Material 3 Timepicker library
│   │   ├── src/lib/           # Directives, components, services, and tokens
│   │   ├── _theming.scss      # Material 3 Sass mixins & tokens
│   │   └── package.json       # Library package definition
│   └── demo/                  # Interactive documentation & live showcase app
├── angular.json               # Angular workspace configuration
└── package.json               # Monorepo scripts and workspace dependencies
```

---

## 🚀 Quick Start for the Library

### 1. Installation

```bash
npm install ngx-mat-timepicker @angular/cdk
```

### 2. Global Sass Theming (`styles.scss`)

```scss
@use '@angular/material' as mat;
@use 'ngx-mat-timepicker' as timepicker;

// Include default Material 3 timepicker styles
@include timepicker.theme();
```

### 3. Usage with Angular Signal Forms (`@angular/forms/signals`)

```html
<mat-form-field appearance="outline">
  <mat-label>Meeting time</mat-label>
  <input 
    matInput 
    [formField]="bookingForm.meetingTime" 
    [ngxMatTimepicker]="picker" 
    placeholder="08:30 AM" 
  />
  <ngx-mat-timepicker-toggle matIconSuffix [for]="picker" />
  <ngx-mat-timepicker #picker />
</mat-form-field>
```

```typescript
import { Component, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  NgxMatTimepicker,
  NgxMatTimepickerInput,
  NgxMatTimepickerToggle,
} from 'ngx-mat-timepicker';

@Component({
  standalone: true,
  imports: [
    FormField,
    MatFormFieldModule,
    MatInputModule,
    NgxMatTimepicker,
    NgxMatTimepickerInput,
    NgxMatTimepickerToggle,
  ],
  templateUrl: './meeting.html',
})
export class MeetingComponent {
  readonly model = signal({ meetingTime: '08:30 AM' });
  readonly bookingForm = form(this.model, (schema) => {
    required(schema.meetingTime, { message: 'Meeting time is required' });
  });
}
```

> [!TIP]
> Always apply `matIconSuffix` to `<ngx-mat-timepicker-toggle>` inside `<mat-form-field>` to ensure it renders cleanly in the trailing icon slot.

---

## 🛠️ Development & Monorepo Commands

### Run the Documentation & Demo App
```bash
npm start
# or: ng serve demo
```
Navigate to `http://localhost:4200/`.

### Build the Library
```bash
npm run build
# Compiles to dist/ngx-mat-timepicker
```

### Build the Demo Application
```bash
npm run build:demo
# Compiles to dist/demo
```

### Run Unit Tests
```bash
# Library tests (Vitest)
npm test -- --watch=false

# Demo application tests
npx ng test demo --watch=false
```

---

## 📖 Complete Documentation

For the full API reference, styling options, and customization guide, see [projects/ngx-mat-timepicker/README.md](projects/ngx-mat-timepicker/README.md).

---

## 📄 License

MIT © [Subhrangsu Chowdhury](https://github.com/Subhrangsu90)
