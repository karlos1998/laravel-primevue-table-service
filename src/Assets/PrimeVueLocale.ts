import {defaultOptions, PrimeVueConfiguration} from "primevue/config";

export const usePrimeVueLocalePL = (overwrite: PrimeVueConfiguration): PrimeVueConfiguration => {

    const data: PrimeVueConfiguration = {
        ...defaultOptions,
        ...overwrite
    };

    if(!data.locale) return data;

    data.locale.startsWith = 'Zaczyna się od';
    data.locale.contains = 'Zawiera';
    data.locale.notContains = 'Nie zawiera';
    data.locale.endsWith = 'Kończy się na';
    data.locale.equals = 'Równe';
    data.locale.notEquals = 'Nie równe';
    data.locale.noFilter = 'Brak filtru';
    data.locale.lt = 'Mniej niż';
    data.locale.lte = 'Mniej niż lub równe';
    data.locale.gt = 'Więcej niż';
    data.locale.gte = 'Więcej niż lub równe';
    data.locale.dateIs = 'Data jest';
    data.locale.dateIsNot = 'Data nie jest';
    data.locale.dateBefore = 'Data jest przed';
    data.locale.dateAfter = 'Data jest po';
    data.locale.clear = 'Wyczyść';
    data.locale.apply = 'Zastosuj';
    data.locale.matchAll = 'Zgodne ze wszystkimi';
    data.locale.matchAny = 'Zgodne z dowolnym';
    data.locale.addRule = 'Dodaj regułę';
    data.locale.removeRule = 'Usuń regułę';
    data.locale.accept = 'Tak';
    data.locale.reject = 'Nie';
    data.locale.choose = 'Wybierz';
    data.locale.upload = 'Prześlij';
    data.locale.cancel = 'Anuluj';
    data.locale.completed = 'Zakończono';
    data.locale.pending = 'Oczekuje';
    data.locale.fileSizeTypes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    data.locale.dayNames = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
    data.locale.dayNamesShort = ['Nie', 'Pon', 'Wto', 'Śro', 'Czw', 'Pią', 'Sob'];
    data.locale.dayNamesMin = ['N', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb'];
    data.locale.monthNames = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
    data.locale.monthNamesShort = ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'];
    data.locale.chooseYear = 'Wybierz rok';
    data.locale.chooseMonth = 'Wybierz miesiąc';
    data.locale.chooseDate = 'Wybierz datę';
    data.locale.prevDecade = 'Poprzednia dekada';
    data.locale.nextDecade = 'Następna dekada';
    data.locale.prevYear = 'Poprzedni rok';
    data.locale.nextYear = 'Następny rok';
    data.locale.prevMonth = 'Poprzedni miesiąc';
    data.locale.nextMonth = 'Następny miesiąc';
    data.locale.prevHour = 'Poprzednia godzina';
    data.locale.nextHour = 'Następna godzina';
    data.locale.prevMinute = 'Poprzednia minuta';
    data.locale.nextMinute = 'Następna minuta';
    data.locale.prevSecond = 'Poprzednia sekunda';
    data.locale.nextSecond = 'Następna sekunda';
    data.locale.am = 'AM';
    data.locale.pm = 'PM';
    data.locale.today = 'Dzisiaj';
    data.locale.weekHeader = 'Tyd';
    data.locale.firstDayOfWeek = 1; // W wielu kulturach tydzień zaczyna się od poniedziałku
    data.locale.showMonthAfterYear = false;
    data.locale.dateFormat = 'dd/mm/yy';
    data.locale.weak = 'Słabe';
    data.locale.medium = 'Średnie';
    data.locale.strong = 'Silne';
    data.locale.passwordPrompt = 'Wprowadź hasło';
// Uwaga: 'emptyFilterMessage' jest oznaczone jako przestarzałe
    data.locale.searchMessage = 'Dostępnych jest {0} wyników';
    data.locale.selectionMessage = 'Wybrano {0} elementów';
    data.locale.emptySelectionMessage = 'Brak wybranych elementów';
    data.locale.emptySearchMessage = 'Brak wyników';
    data.locale.emptyMessage = 'Brak dostępnych opcji';

    if(!data.locale.aria) return data

    data.locale.aria.trueLabel = 'Prawda';
    data.locale.aria.falseLabel = 'Fałsz';
    data.locale.aria.nullLabel = 'Nie wybrano';
    data.locale.aria.star = '1 gwiazdka';
    data.locale.aria.stars = '{star} gwiazdki'; // Użyj odpowiedniej formy liczbowej w implementacji
    data.locale.aria.selectAll = 'Zaznacz wszystkie elementy';
    data.locale.aria.unselectAll = 'Odznacz wszystkie elementy';
    data.locale.aria.close = 'Zamknij';
    data.locale.aria.previous = 'Poprzedni';
    data.locale.aria.next = 'Następny';
    data.locale.aria.navigation = 'Nawigacja';
    data.locale.aria.scrollTop = 'Przewiń do góry';
    data.locale.aria.moveTop = 'Przenieś na górę';
    data.locale.aria.moveUp = 'Przenieś w górę';
    data.locale.aria.moveDown = 'Przenieś w dół';
    data.locale.aria.moveBottom = 'Przenieś na dół';
    data.locale.aria.moveToTarget = 'Przenieś do celu';
    data.locale.aria.moveToSource = 'Przenieś do źródła';
    data.locale.aria.moveAllToTarget = 'Przenieś wszystko do celu';
    data.locale.aria.moveAllToSource = 'Przenieś wszystko do źródła';
    data.locale.aria.pageLabel = 'Strona {page}';
    data.locale.aria.firstPageLabel = 'Pierwsza strona';
    data.locale.aria.lastPageLabel = 'Ostatnia strona';
    data.locale.aria.nextPageLabel = 'Następna strona';
    data.locale.aria.prevPageLabel = 'Poprzednia strona';
    data.locale.aria.rowsPerPageLabel = 'Wierszy na stronę';
    data.locale.aria.jumpToPageDropdownLabel = 'Przejdź do strony Dropdown';
    data.locale.aria.jumpToPageInputLabel = 'Przejdź do strony Input';
    data.locale.aria.selectRow = 'Wybrano wiersz';
    data.locale.aria.unselectRow = 'Odznaczono wiersz';
    data.locale.aria.expandRow = 'Rozwinięto wiersz';
    data.locale.aria.collapseRow = 'Zwinięto wiersz';
    data.locale.aria.showFilterMenu = 'Pokaż menu filtrów';
    data.locale.aria.hideFilterMenu = 'Ukryj menu filtrów';
    data.locale.aria.filterOperator = 'Operator filtru';
    data.locale.aria.filterConstraint = 'Ograniczenie filtru';
    data.locale.aria.editRow = 'Edytuj wiersz';
    data.locale.aria.saveEdit = 'Zapisz edycję';
    data.locale.aria.cancelEdit = 'Anuluj edycję';
    data.locale.aria.listView = 'Widok listy';
    data.locale.aria.gridView = 'Widok siatki';
    data.locale.aria.slide = 'Slajd';
    data.locale.aria.slideNumber = 'Numer slajdu {slideNumber}';
    data.locale.aria.zoomImage = 'Powiększ obraz';
    data.locale.aria.zoomIn = 'Powiększ';
    data.locale.aria.zoomOut = 'Pomniejsz';
    data.locale.aria.rotateRight = 'Obróć w prawo';
    data.locale.aria.rotateLeft = 'Obróć w lewo';

    return data;
}
