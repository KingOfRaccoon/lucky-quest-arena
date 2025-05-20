import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {useToast} from "@/hooks/use-toast";

// Русские буквы, которые используются в автомобильных номерах
// (те, которые совпадают по написанию с латинскими)
const ALLOWED_LETTERS = ['А', 'В', 'Е', 'К', 'М', 'Н', 'О', 'Р', 'С', 'Т', 'У', 'Х'];

interface CarNumberSelectionProps {
    selectedLetter: string;
    setSelectedLetter: (letter: string) => void;
    firstNumbers: string;
    setFirstNumbers: (numbers: string) => void;
    secondNumbers: string;
    setSecondNumbers: (numbers: string) => void;
    thirdNumbers: string;
    setThirdNumbers: (numbers: string) => void;
    onValidationChange: (isValid: boolean) => void;
}

const CarNumberSelection = ({
                                selectedLetter,
                                setSelectedLetter,
                                firstNumbers,
                                setFirstNumbers,
                                secondNumbers,
                                setSecondNumbers,
                                thirdNumbers,
                                setThirdNumbers,
                                onValidationChange
                            }: CarNumberSelectionProps) => {
    const [isFirstNumbersValid, setIsFirstNumbersValid] = useState(false);
    const [isSecondNumbersValid, setIsSecondNumbersValid] = useState(false);
    const [isThirdNumbersValid, setIsThirdNumbersValid] = useState(false);

    // Проверка валидности номера и уведомление родительского компонента
    const updateValidationStatus = (
        firstValid: boolean,
        secondValid: boolean,
        thirdValid: boolean,
        letter: string
    ) => {
        const isValid = firstValid && secondValid && thirdValid && Boolean(letter);
        onValidationChange(isValid);
        return isValid;
    };

    // Проверка и обработка ввода для первой группы цифр (3 цифры)
    const handleFirstNumbersChange = (value: string) => {
        // Оставляем только цифры и ограничиваем длину
        const sanitized = value.replace(/\D/g, '').slice(0, 3);
        setFirstNumbers(sanitized);

        const isValid = sanitized.length === 3;
        setIsFirstNumbersValid(isValid);
        updateValidationStatus(isValid, isSecondNumbersValid, isThirdNumbersValid, selectedLetter);
    };

    // Проверка и обработка ввода для второй группы цифр (2 цифры)
    const handleSecondNumbersChange = (value: string) => {
        // Оставляем только цифры и ограничиваем длину
        const sanitized = value.replace(/\D/g, '').slice(0, 2);
        setSecondNumbers(sanitized);

        const isValid = sanitized.length === 2;
        setIsSecondNumbersValid(isValid);
        updateValidationStatus(isFirstNumbersValid, isValid, isThirdNumbersValid, selectedLetter);
    };

    // Проверка и обработка ввода для третьей группы цифр (2 цифры)
    const handleThirdNumbersChange = (value: string) => {
        // Оставляем только цифры и ограничиваем длину
        const sanitized = value.replace(/\D/g, '').slice(0, 2);
        setThirdNumbers(sanitized);

        const isValid = sanitized.length === 2;
        setIsThirdNumbersValid(isValid);
        updateValidationStatus(isFirstNumbersValid, isSecondNumbersValid, isValid, selectedLetter);
    };

    // Обработка выбора буквы
    const handleLetterChange = (value: string) => {
        setSelectedLetter(value);
        updateValidationStatus(isFirstNumbersValid, isSecondNumbersValid, isThirdNumbersValid, value);
    };

    // Генерация случайного номера
    const handleRandomPick = () => {
        // Случайная буква из разрешенных
        const randomLetter = ALLOWED_LETTERS[Math.floor(Math.random() * ALLOWED_LETTERS.length)];

        // Случайные цифры для первого поля (3 цифры, от 1 до 999)
        const randomFirst = (Math.floor(Math.random() * 999) + 1).toString().padStart(3, '0');

        // Случайные буквы для второго поля (2 буквы)
        let randomSecondLetters = '';
        for (let i = 0; i < 2; i++) {
            randomSecondLetters += ALLOWED_LETTERS[Math.floor(Math.random() * ALLOWED_LETTERS.length)];
        }

        // Регионы РФ для ав��омобильных номеров (актуальные)
        const validRegions = [
            "01", "02", "03", "04", "05", "06", "07", "08", "09",
            "10", "11", "12", "13", "14", "15", "16", "17", "18", "19",
            "21", "22", "23", "24", "25", "26", "27", "28", "29",
            "30", "31", "32", "33", "34", "35", "36", "37", "38", "39",
            "40", "41", "42", "43", "44", "45", "46", "47", "48", "49",
            "50", "51", "52", "53", "54", "55", "56", "57", "58", "59",
            "60", "61", "62", "63", "64", "65", "66", "67", "68", "69",
            "70", "71", "72", "73", "74", "75", "76", "77", "78", "79",
            "80", "81", "82", "83", "84", "85", "86", "87", "88", "89",
            "90", "91", "92", "93", "94", "95", "96", "97", "98", "99",
        ];

        // Случайный регион из списка допустимых
        const randomThird = validRegions[Math.floor(Math.random() * validRegions.length)];

        setSelectedLetter(randomLetter);
        setFirstNumbers(randomFirst);
        setSecondNumbers(randomSecondLetters);
        setThirdNumbers(randomThird);

        // Установка всех флагов валидации н�� true
        setIsFirstNumbersValid(true);
        setIsSecondNumbersValid(true);
        setIsThirdNumbersValid(true);
        onValidationChange(true);
    };

    // Очистка всех полей
    const handleClearSelection = () => {
        setSelectedLetter('');
        setFirstNumbers('');
        setSecondNumbers('');
        setThirdNumbers('');

        setIsFirstNumbersValid(false);
        setIsSecondNumbersValid(false);
        setIsThirdNumbersValid(false);
        onValidationChange(false);
    };

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="text-center">Выбор автомобильного номера</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center mb-4">
                    <p className="text-muted-foreground mb-2">
                        Укажите автомобильный номер в формате А 777 АА 77
                    </p>
                    <div className="flex justify-center gap-1 mt-4 mb-6">
                        <div
                            className="relative flex items-center justify-center"
                            style={{
                                width: 340,
                                height: 70,
                                backgroundImage: "url('/plate3.png')",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                            }}
                        >
                            {/* Поля ввода позиционируются поверх картинки */}
                            <div
                                className="absolute w-full h-full flex flex-col items-center justify-center">
                                <div className="flex items-center justify-center gap-2 mx-auto" style={{ marginLeft: "14px"}} >
                                    <Input
                                        className="w-14 h-14 text-2xl text-center bg-transparent border-none shadow-none focus:ring-0 focus:outline-none uppercase"
                                        value={selectedLetter}
                                        onChange={e => {
                                            // Только одна кириллическая буква
                                            const sanitized = e.target.value.replace(new RegExp(`[^${ALLOWED_LETTERS.join('')}]`, 'gi'), '').toUpperCase().slice(0, 1);
                                            setSelectedLetter(sanitized);
                                            updateValidationStatus(isFirstNumbersValid, isSecondNumbersValid, isThirdNumbersValid, sanitized);
                                        }}
                                        placeholder="А"
                                        maxLength={1}
                                        style={{letterSpacing: 2, fontSize: "30px", padding: '0px 2px', borderColor: 'transparent'}}
                                    />
                                    <Input
                                        className="w-24 h-12 text-8xl text-center bg-transparent border-transparent border-none shadow-none focus:ring-1 focus:outline-none"
                                        value={firstNumbers}
                                        onChange={(e) => handleFirstNumbersChange(e.target.value)}
                                        placeholder="777"
                                        inputMode="numeric"
                                        maxLength={3}
                                        style={{letterSpacing: 2, fontSize: "34px",  borderColor: 'transparent'}}
                                    />
                                    <Input
                                        className="w-16 h-14 text-2xl text-center bg-transparent border-none shadow-none focus:ring-0 focus:outline-none uppercase"
                                        value={secondNumbers}
                                        onChange={e => {
                                            // Только кириллические буквы, максимум 2
                                            const sanitized = e.target.value
                                              .replace(new RegExp(`[^${ALLOWED_LETTERS.join('')}]`, 'gi'), '')
                                              .toUpperCase()
                                              .split('')
                                              .filter(char => ALLOWED_LETTERS.includes(char))
                                              .slice(0, 2)
                                              .join('');
                                            setSecondNumbers(sanitized);
                                            // Валидация: только 3 буквы
                                            const isValid = sanitized.length === 2;
                                            setIsSecondNumbersValid(isValid);
                                            updateValidationStatus(isFirstNumbersValid, isValid, isThirdNumbersValid, selectedLetter);
                                        }}
                                        placeholder="АА"
                                        maxLength={2}
                                        style={{letterSpacing: 2, fontSize: "30px", padding: '0px 2px', borderColor: 'transparent'}}
                                    />
                                    <div style={{ position: 'relative', width: '56px', height: '0' }}>
                                        <Input
                                            className="w-14 h-8 text-2xl text-center bg-transparent border-none shadow-none focus:ring-0 focus:outline-none uppercase absolute"
                                            style={{ top: '-26px', left: '4px', fontSize: "20px", letterSpacing: 2, borderColor: 'transparent' }}
                                            value={thirdNumbers}
                                            onChange={(e) => handleThirdNumbersChange(e.target.value)}
                                            placeholder="77"
                                            maxLength={2}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-4">
                    <Button
                        variant="outline"
                        onClick={handleRandomPick}
                        className="flex items-center"
                    >
                        Случайный номер
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleClearSelection}
                        className="flex items-center"
                    >
                        Очистить
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default CarNumberSelection;
