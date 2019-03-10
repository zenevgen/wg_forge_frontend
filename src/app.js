// this is an example of improting data from JSON
import orders from '../data/orders.json';
import users from '../data/users.json';
import companies from '../data/companies.json';

export default (function () {
    let currentOrdersList = orders;

    let usersMap = {};
    users.forEach(user => usersMap[user['id']] = user);

    orders.forEach(addOrderRow);
    function addOrderRow(item) {
        let newTr = document.createElement("tr");
        newTr.setAttribute("id", "order_"+item['id']);

        let newTransactionId = document.createElement("td");
        newTransactionId.appendChild(document.createTextNode(item['transaction_id']));

        let newUserInfo = document.createElement("td");
        newUserInfo.setAttribute("class", "user_data");
        createUserName(item.user_id, newUserInfo);

        let newOrderDate = document.createElement("td");
        let orderDate = new Date(item['created_at']*1000);
        newOrderDate.appendChild(document.createTextNode(orderDate.toLocaleString().replace(/\./g, '/').replace(',', '')));

        let newOrderAmount = document.createElement("td");
        let orderAmount = new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'USD' }).format(item['total']);
        newOrderAmount.appendChild(document.createTextNode(orderAmount));

        let newCardNumber = document.createElement("td");
        let cardNumber = item['card_number'].split('').fill('*', 2, -4).join('');
        newCardNumber.appendChild(document.createTextNode(cardNumber));

        let newCardType = document.createElement("td");
        newCardType.appendChild(document.createTextNode(item['card_type']));

        let newLocation = document.createElement("td");
        let locationTextString = item['order_country']+ ' (' +item['order_ip'] + ')';
        newLocation.appendChild(document.createTextNode(locationTextString));

        newTr.appendChild(newTransactionId);
        newTr.appendChild(newUserInfo);
        newTr.appendChild(newOrderDate);
        newTr.appendChild(newOrderAmount);
        newTr.appendChild(newCardNumber);
        newTr.appendChild(newCardType);
        newTr.appendChild(newLocation);

        let currentTableBody = document.getElementsByTagName("tbody")[0];
        currentTableBody.appendChild(newTr);
    }


    function createUserName(id, parent) {

        let userAnchor = document.createElement("a");
        userAnchor.setAttribute('href','#');

        let user = usersMap[id];

        if (user.gender === 'Male') {
            userAnchor.innerText = 'Mr. ' + user.first_name + ' ' + user.last_name;
        } else {
            userAnchor.innerText = 'Ms. ' + user.first_name + ' ' + user.last_name;
        }

        parent.appendChild(userAnchor);

        let extendedUserInfo = document.createElement('div');
        extendedUserInfo.setAttribute("class","user-details");
        extendedUserInfo.style.display = 'none';

        let birthday = document.createElement('p');
        birthday.innerText = `Birthday: ${new Date(user.birthday*1000).toLocaleString('en-US')}`;
        extendedUserInfo.appendChild(birthday);

        let photo = document.createElement('p');
        let image = document.createElement('img');
        image.src = user.avatar;
        image.width = '100';
        photo.appendChild(image);
        extendedUserInfo.appendChild(photo);

        function getCompanyObj(id) {
            let company = companies.filter((item) => {
                return item.id === id;
            });
            return company[0];
        }

        let company = getCompanyObj(user.company_id)?getCompanyObj(user.company_id):{};
        let companyName = document.createElement('p');
        companyName.innerHTML = `Company: <a href="${company.url}" target="_blank">${company.title}</a>`;

        extendedUserInfo.appendChild(companyName);

        let industry = document.createElement('p');
        industry.innerText = `Industry: ${company.industry} / ${company.sector}`;
        extendedUserInfo.appendChild(industry);

        parent.appendChild(extendedUserInfo);

        function clickHandler(event) {
            event.preventDefault();
            if (extendedUserInfo.style.display === 'none') {
                extendedUserInfo.style.display = 'block';
            } else {
                extendedUserInfo.style.display = 'none';
            }
        }
        userAnchor.addEventListener('click', clickHandler);
    }


    let arrSortByTransId = orders.slice().sort(function (a, b) {
        if (a.transaction_id > b.transaction_id) {
            return 1;
        }
        if (a.transaction_id < b.transaction_id) {
            return -1;
        }
        return 0;
    });

    let arrSortByName = orders.slice().sort(function (a, b) {
        if (usersMap[a.user_id].first_name + usersMap[a.user_id].last_name > usersMap[b.user_id].first_name + usersMap[b.user_id].last_name) {
            return 1;
        }
        if (usersMap[a.user_id].first_name + usersMap[a.user_id].last_name < usersMap[b.user_id].first_name + usersMap[b.user_id].last_name) {
            return -1;
        }
        return 0;
    });

    let arrSortByDate = orders.slice().sort( function (a, b) {
        return a.created_at - b.created_at;
    });

    let arrSortByAmount = orders.slice().sort( function (a, b) {
        return a.total - b.total;
    });

    let arrSortByCardType = orders.slice().sort(function (a, b) {
        if (a.card_type > b.card_type) {
            return 1;
        }
        if (a.card_type < b.card_type) {
            return -1;
        }
        return 0;
    });

    let arrSortByLocation = orders.slice().sort(function (a, b) {
        if (a.order_country + a.order_ip > b.order_country + b.order_ip) {
            return 1;
        }
        if (a.order_country + a.order_ip < b.order_country + b.order_ip) {
            return -1;
        }
        return 0;
    });


    let sortMap = {
        transactionID: arrSortByTransId,
        userInfo: arrSortByName,
        orderDate: arrSortByDate,
        orderAmount: arrSortByAmount,
        cardType: arrSortByCardType,
        location: arrSortByLocation
    };

    let thElements = document.getElementsByTagName('th');
    for (let i = 0; i < thElements.length; i++) {
        if (Object.keys(sortMap).indexOf(thElements[i].id) >= 0) {
            thElements[i].setAttribute("style", "cursor: pointer");
            thElements[i].addEventListener('click', clickHandler);
        }
    }

    function clickHandler(event) {
        addSpanLabel(event.target);
        document.getElementsByTagName("tbody")[0].innerHTML = '';
        sortMap[event.target.id].forEach(addOrderRow);
        currentOrdersList = sortMap[event.target.id];
    }

    function addSpanLabel(item) {
        for (let i = 0; i < thElements.length; i++) {
            let childNode = thElements[i].getElementsByTagName('span');
            if (childNode[0]) {
                thElements[i].removeChild(childNode[0]);
            }
        }
        item.innerHTML += "<span>&#8595;</span>";
    }

    function medianCalculating(values){
        values.sort(function(a,b){
            return a-b;
        });

        if(values.length ===0) return 0;

        let half = Math.floor(values.length / 2);

        if (values.length % 2)
            return values[half];
        else
            return (values[half - 1] + values[half]) / 2.0;
    }

    function normalizeMoneyString(value) {
        return new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'USD' }).format(value);
    }

    function setStatistics(statisticsOrders) {
        document.getElementById('ordersCount').innerText = statisticsOrders.length > 0 ? statisticsOrders.length : 'n/a';
        let ordersTotal = statisticsOrders.reduce((total, item) => (total + (+item['total'])), 0);
        document.getElementById('ordersTotal').innerText = ordersTotal > 0 ? normalizeMoneyString(ordersTotal) : 'n/a';
        let medianValue = medianCalculating(statisticsOrders.map(item => +item['total']));
        document.getElementById('medianValue').innerText = medianValue > 0 ?  normalizeMoneyString(medianValue) : 'n/a';
        document.getElementById('averageCheck').innerText = statisticsOrders.length > 0 ? normalizeMoneyString(ordersTotal / statisticsOrders.length) : 'n/a';
        let femaleCount = 0;
        let femaleOrdersTotal = statisticsOrders.reduce((total, item) => {
            let itemTotal = 0;
            if (usersMap[item['user_id']]['gender'] === 'Female') {
                itemTotal = +item['total'];
                femaleCount++;
            }
            return total + itemTotal;
        }, 0);
        document.getElementById('averageCheckFemale').innerText = femaleCount > 0 ? normalizeMoneyString(femaleOrdersTotal / femaleCount) : 'n/a';
        let maleCount = 0;
        let maleOrdersTotal = statisticsOrders.reduce((total, item) => {
            let itemTotal = 0;
            if (usersMap[item['user_id']]['gender'] === 'Male') {
                itemTotal = +item['total'];
                maleCount++;
            }
            return total + itemTotal;
        }, 0);
        document.getElementById('averageCheckMale').innerText = maleCount > 0 ? normalizeMoneyString(maleOrdersTotal / maleCount) : 'n/a';
    }

    setStatistics(orders);

    document.getElementById('search').addEventListener('input', function (event) { // input change
        let relevantOrders = currentOrdersList.filter(order => {
            return order['transaction_id'].indexOf(event.target.value) !== -1
                || order['total'].indexOf(event.target.value) !== -1
                || order['card_type'].indexOf(event.target.value) !== -1
                || order['order_country'].indexOf(event.target.value) !== -1
                || order['order_country'].indexOf(event.target.value) !== -1
                || order['order_ip'].indexOf(event.target.value) !== -1
                || usersMap[order['user_id']]['first_name'].indexOf(event.target.value) !== -1
                || usersMap[order['user_id']]['last_name'].indexOf(event.target.value) !== -1;
        });
        document.getElementsByTagName("tbody")[0].innerHTML = '';
        if (relevantOrders.length === 0) {
            let newTr = document.createElement("tr");
            let newTd = document.createElement("td");
            newTd.appendChild(document.createTextNode('Nothing found'));
            newTd.setAttribute('colspan', 7);
            newTd.setAttribute('style', 'text-align:center');
            newTr.appendChild(newTd);
            let currentTableBody = document.getElementsByTagName("tbody")[0];
            currentTableBody.appendChild(newTr);
        } else {
            relevantOrders.forEach(addOrderRow);
        }
        setStatistics(relevantOrders);
    });
}());
