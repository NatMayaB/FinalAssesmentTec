# Instructions to Add More Languages

## 1. Add a New Language File
1. Navigate to the `languages` folder.
2. Review the format of any existing `.json` file, such as `english.json`.
   - Example format from `english.json`: 
     ```json
     {
       "clientDataUI": "Client Data UI"
     }
     ```
   - Only translate the text after the colon (`:`). For example, change `"Client Data UI"` to the corresponding translation, but **do not change** the key `"clientDataUI"`.
3. Save your new language file in the same folder with the appropriate name (e.g., `spanish.json`, `french.json`).

## 2. Setting Up the Language in `i18n.js`
1. Inside the `src` folder, locate the `i18n.js` file.
2. At the top of the file, you will see import statements like:
   ```js
   import en from './languages/english.json';
   ```
   - Add an import for your new language `.json` file. For example, for Spanish:
     ```js
     import es from './languages/spanish.json';
     ```
3. Update the language reference in the `resources` section:
   - Locate the `resources` object, which looks like this:
     ```js
     resources: {
       en: {
         translation: en,
       },
       es: {
         translation: es,
       },
       fr: {
         translation: fr,
       },
       pt: {
         translation: pt,
       },
       ct: {
         translation: ct,
       }
     }
     ```
   - Add your new language below the existing ones. For example, if your new language is `xy`, it should look like this:
     ```js
     resources: {
       en: {
         translation: en,
       },
       es: {
         translation: es,
       },
       fr: {
         translation: fr,
       },
       pt: {
         translation: pt,
       },
       ct: {
         translation: ct,
       },
       xy: {
         translation: xy,
       }
     }
     ```

## 3. Add the New Language to the Dropdown Menu
1. Navigate to `AppHeader.js` inside the `components` folder.
2. Find the code for the language dropdown menu. It should look something like this:
   ```jsx
   {/* Language Switcher Dropdown */}
   <CDropdown variant="nav-item" placement="bottom-end">
     <CDropdownToggle caret={false}>
       🌐 {/* Icon for Language */}
     </CDropdownToggle>
     <CDropdownMenu>
       <CDropdownItem
         active={i18n.language === 'en'}
         onClick={() => changeLanguage('en')}
       >
         English
       </CDropdownItem>
       <CDropdownItem
         active={i18n.language === 'es'}
         onClick={() => changeLanguage('es')}
       >
         Español
       </CDropdownItem>
   ```
3. Add your new language below the existing languages. For example, for language `xy`, add:
   ```jsx
   <CDropdownItem
     active={i18n.language === 'xy'}
     onClick={() => changeLanguage('xy')}
   >
     XY
   </CDropdownItem>
   ```

## 4. Notes
- **Important:** Do not edit the files inside the `header` folder as they manage the visual styles and formats of the app.
- Once the changes are made, run the application to ensure the language switch works correctly.
