import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lottery } from "@/LotteriesContext";

interface LotteryRulesProps {
  lottery: Lottery;
  maxSelectionOptions: number;
}

const LotteryRules = ({ lottery, maxSelectionOptions }: LotteryRulesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Правила лотереи</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{lottery.description_md}</p>

        <div className="space-y-2">
          <h3 className="font-semibold">Как работает розыгрыш</h3>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Приобретите один или несколько билетов</li>
            <li>Выберите {maxSelectionOptions} чисел для каждого билета или воспользуйтесь автовыбором</li>
            <li>Дождитесь розыгрыша, который проводится каждые N минут</li>
            <li>Результаты будут доступны в вашем личном кабинете</li>
            <li>Выигрыш зачисляется автоматически на счёт</li>
          </ul>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold">Выигрышные комбинации</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="pb-2 text-left">Совпадения</th>
                  <th className="pb-2 text-right">Выигрыш</th>
                </tr>
              </thead>
              <tbody>
                {lottery.lottery_type_id === 1 ? (
                  <>
                    <tr className="border-b">
                      <td className="py-2">6 из 6</td>
                      <td className="py-2 text-right font-medium">{lottery.price_currency * 1000} ₽</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">5 из 6</td>
                      <td className="py-2 text-right font-medium">{Math.round(lottery.price_currency * 1000 * 0.1)} ₽</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">4 из 6</td>
                      <td className="py-2 text-right font-medium">{Math.round(lottery.price_currency * 1000 * 0.05)} ₽</td>
                    </tr>
                    <tr>
                      <td className="py-2">3 из 6</td>
                      <td className="py-2 text-right font-medium">{Math.round(lottery.price_currency * 5)} ₽</td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr className="border-b">
                      <td className="py-2">4 из 4</td>
                      <td className="py-2 text-right font-medium">{lottery.bonus_credit * 10} бонусов</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">3 из 4</td>
                      <td className="py-2 text-right font-medium">500 бонусов</td>
                    </tr>
                    <tr>
                      <td className="py-2">2 из 4</td>
                      <td className="py-2 text-right font-medium">100 бонусов</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LotteryRules;
