const fieldValueCurrency = document.querySelector('#valueCurrency')
const btnExchange = document.querySelector('#exchange')
const option1 = document.querySelector('#selectcoin1')
const option2 = document.querySelector('#selectcoin2')
const exchangeResult = document.querySelector('.result')
const flag1 = document.querySelector('#flag1')
const flag2 = document.querySelector('#flag2')

let valueopt1 = 'BRL'
let valueopt2 = 'USD'

async function ExchangeAPI() {
    const apiURL = 'https://v6.exchangerate-api.com/v6/de4765e4684e549407ea826f/latest/USD'

    try {
        const response = await fetch(apiURL)
        const data = await response.json()

        if (data.result === 'success') {
            return data
        } else {
            throw new Error('Falha ao obter os dados da API.')
        }
    } catch (error) {
        console.error('Erro na API:', error)
    }
}

async function Converter() {
    const api = await ExchangeAPI()
    if (!api) {
        exchangeResult.textContent = 'Erro ao obter taxa de câmbio.'
        return
    }

    const coins = api.conversion_rates
    const amount = parseFloat(fieldValueCurrency.value)

    if (isNaN(amount) || amount <= 0) {
        exchangeResult.textContent = 'Digite um valor válido.'
        return
    }

    const rateOpt1 = coins[valueopt1]
    const rateOpt2 = coins[valueopt2]
    const convertedValue = (amount * rateOpt2) / rateOpt1

    exchangeResult.textContent = `${amount.toFixed(2)} ${valueopt1} = ${convertedValue.toFixed(2)} ${valueopt2}`
}

function addOpt(currencies, defaultVal, select, flagElement) {
    select.innerHTML = ''
    currencies.forEach(currency => {
        const option = document.createElement('option')
        option.value = currency
        option.textContent = currency
        if (currency === defaultVal) option.selected = true
        select.appendChild(option)
    })
    updateFlag(select, flagElement)
}

function updateFlag(select, flagElement) {
    const countryCode = select.value.substring(0, 2).toLowerCase()
    flagElement.src = `https://flagcdn.com/48x36/${countryCode}.png`
}

(async function () {
    const api = await ExchangeAPI()
    if (!api) return

    const currencies = Object.keys(api.conversion_rates)

    addOpt(currencies, 'BRL', option1, flag1)
    addOpt(currencies, 'USD', option2, flag2)

    option1.addEventListener("change", function () {
        valueopt1 = option1.value
        updateFlag(option1, flag1)
    })

    option2.addEventListener("change", function () {
        valueopt2 = option2.value
        updateFlag(option2, flag2)
    })

    btnExchange.addEventListener('click', Converter)

    fieldValueCurrency.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault()
            btnExchange.click()
        }
    })
})()
