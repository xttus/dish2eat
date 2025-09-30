class FoodWheelApp {
    constructor() {
        this.canvas = document.getElementById('wheelCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.isSpinning = false;
        this.currentRotation = 0;
        this.selectedDish = null;

        // 菜品数据
        this.dishData = {
            breakfast: {
                mixed: ['豆浆油条', '小笼包', '煎饼果子', '粥配咸菜', '面包牛奶', '鸡蛋灌饼', '胡辣汤', '肉夹馍'],
                western: ['吐司', '燕麦粥', '牛角包', '华夫饼', '班尼迪克蛋', '培根煎蛋'],
                chinese: ['包子', '馒头', '稀饭', '咸菜', '茶叶蛋', '豆腐脑']
            },
            lunch: {
                mixed: ['宫保鸡丁', '红烧肉', '麻婆豆腐', '鱼香肉丝', '糖醋排骨', '回锅肉', '青椒肉丝', '蒜蓉菜心'],
                sichuan: ['麻婆豆腐', '水煮鱼', '回锅肉', '宫保鸡丁', '鱼香肉丝', '口水鸡', '毛血旺', '辣子鸡'],
                cantonese: ['白切鸡', '叉烧', '蒸蛋羹', '广式炒河粉', '煲仔饭', '白灼菜心', '糖醋排骨'],
                hunan: ['剁椒鱼头', '口味虾', '毛氏红烧肉', '湘式小炒肉', '酸辣土豆丝', '剁椒茄子'],
                western: ['意大利面', '牛排', '汉堡', '沙拉', '披萨', '三明治', '炸鸡', '薯条'],
                japanese: ['寿司', '拉面', '天妇罗', '猪排饭', '牛丼', '乌冬面', '鸡蛋烧', '味噌汤'],
                korean: ['韩式烤肉', '石锅拌饭', '泡菜', '韩式炸鸡', '冷面', '部队锅', '海鲜饼']
            },
            dinner: {
                mixed: ['糖醋排骨', '红烧鱼', '白切鸡', '蒜蓉蒸扇贝', '干煸豆角', '凉拌黄瓜', '紫菜蛋花汤'],
                sichuan: ['水煮牛肉', '麻辣香锅', '口水鸡', '蒜泥白肉', '担担面', '酸菜鱼', '麻辣火锅'],
                cantonese: ['白切鸡', '蒸鱼', '蜜汁叉烧', '广式点心', '老火汤', '盐焗鸡翅'],
                western: ['牛排', '意面', '烤鸡', '海鲜', '沙拉', '汤', '面包', '红酒'],
                japanese: ['刺身', '烤鱼', '天妇罗', '寿司', '乌冬面', '味噌汤', '日式烧肉'],
                korean: ['韩式烤肉', '泡菜火锅', '海鲜煎饼', '韩式拌饭', '冷面', '参鸡汤']
            },
            snack: {
                mixed: ['奶茶', '烧烤', '臭豆腐', '煎饼', '糖葫芦', '炸鸡', '爆米花', '冰淇淋'],
                western: ['薯片', '汉堡', '炸鸡', '披萨', '甜甜圈', '纸杯蛋糕'],
                chinese: ['煎饼果子', '肉夹馍', '糖葫芦', '臭豆腐', '烧饼', '茶叶蛋']
            },
            drink: {
                mixed: ['奶茶', '咖啡', '果汁', '可乐', '柠檬水', '豆浆', '酸奶', '绿茶'],
                western: ['咖啡', '可乐', '果汁', '汽水', '红酒', '啤酒'],
                chinese: ['茶', '豆浆', '酸梅汤', '凉茶', '花茶', '白开水']
            },
            nightFood: {
                mixed: ['烧烤', '小龙虾', '炸鸡', '泡面', '粥', '馄饨', '煎饼', '夜宵汤'],
                sichuan: ['麻辣烫', '串串香', '冒菜', '酸辣粉', '重庆小面'],
                cantonese: ['粥', '云吞面', '煲仔饭', '港式茶餐厅', '白粥配咸菜']
            }
        };

        this.colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#F39C12', '#E74C3C', '#3498DB', '#2ECC71',
            '#9B59B6', '#F1C40F', '#E67E22', '#1ABC9C', '#34495E'
        ];

        this.init();
    }

    init() {
        this.loadLocalData();
        this.setupEventListeners();
        // 确保canvas初始状态正确
        this.canvas.style.transform = 'none';
        this.canvas.classList.remove('spinning');
        this.updateWheel();
        this.loadLastResult();
        this.parseURLParams();
        this.updateFavoritesList();
        this.updateHistoryList();
    }

    setupEventListeners() {
        // 按钮事件
        document.getElementById('spinBtn').addEventListener('click', () => this.spin());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('customBtn').addEventListener('click', () => this.showCustomModal());
        document.getElementById('againBtn').addEventListener('click', () => this.spin());
        document.getElementById('favoriteBtn').addEventListener('click', () => this.addToFavorites());
        document.getElementById('shareBtn').addEventListener('click', () => this.showShareModal());

        // 选择器事件
        document.getElementById('mealType').addEventListener('change', () => this.updateWheel());
        document.getElementById('cuisine').addEventListener('change', () => this.updateWheel());

        // 弹窗事件
        document.getElementById('closeModal').addEventListener('click', () => this.hideCustomModal());
        document.getElementById('closeShareModal').addEventListener('click', () => this.hideShareModal());
        document.getElementById('saveDishes').addEventListener('click', () => this.saveCustomDishes());
        document.getElementById('copyUrl').addEventListener('click', () => this.copyShareUrl());

        // 点击弹窗外部关闭
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.style.display = 'none';
                });
            }
            if (e.key === ' ' && !this.isSpinning) {
                e.preventDefault();
                this.spin();
            }
        });

        // 调整canvas大小
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const isMobile = window.innerWidth <= 768;
        const size = isMobile ? 300 : 400;

        this.canvas.width = size;
        this.canvas.height = size;
        this.canvas.style.width = size + 'px';
        this.canvas.style.height = size + 'px';

        this.updateWheel();
    }

    getCurrentDishes() {
        const mealType = document.getElementById('mealType').value;
        const cuisine = document.getElementById('cuisine').value;

        if (cuisine === 'custom') {
            return this.getCustomDishes();
        }

        if (this.dishData[mealType] && this.dishData[mealType][cuisine]) {
            return this.dishData[mealType][cuisine];
        }

        // 如果没有对应的菜系，返回混合菜系
        return this.dishData[mealType]?.mixed || ['没有可选菜品'];
    }

    updateWheel() {
        const dishes = this.getCurrentDishes();
        this.drawWheel(dishes);
    }

    drawWheel(dishes) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const anglePerSlice = (2 * Math.PI) / dishes.length;

        dishes.forEach((dish, index) => {
            // 从正上方开始绘制（-π/2），让第0个扇形对准箭头
            const startAngle = index * anglePerSlice - Math.PI / 2 + this.currentRotation;
            const endAngle = (index + 1) * anglePerSlice - Math.PI / 2 + this.currentRotation;

            // 绘制扇形
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            this.ctx.closePath();
            this.ctx.fillStyle = this.colors[index % this.colors.length];
            this.ctx.fill();
            this.ctx.stroke();

            // 绘制文字
            this.ctx.save();
            this.ctx.translate(centerX, centerY);
            this.ctx.rotate(startAngle + anglePerSlice / 2);
            this.ctx.fillStyle = '#333';
            this.ctx.font = this.canvas.width > 300 ? '14px Arial' : '12px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.textBaseline = 'middle';

            const textRadius = radius * 0.7;
            this.ctx.fillText(dish, textRadius, 0);
            this.ctx.restore();
        });

        // 绘制中心圆
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#333';
        this.ctx.fill();
        this.ctx.stroke();
    }

    spin() {
        if (this.isSpinning) return;

        const dishes = this.getCurrentDishes();
        if (dishes.length === 0 || dishes[0] === '没有可选菜品') {
            alert('请先添加菜品！');
            return;
        }

        this.isSpinning = true;
        document.getElementById('spinBtn').disabled = true;
        document.getElementById('resultDisplay').style.display = 'none';

        // 随机旋转角度
        const spins = 3 + Math.random() * 3; // 3-6圈
        const finalAngle = Math.random() * 2 * Math.PI;
        const totalRotation = spins * 2 * Math.PI + finalAngle;

        // 计算最终选中的菜品
        const anglePerSlice = (2 * Math.PI) / dishes.length;
        const finalRotation = totalRotation % (2 * Math.PI);

        // 箭头在正上方(-π/2)，转盘从-π/2开始绘制
        // 当转盘旋转finalRotation后，箭头相对于转盘的角度是-finalRotation
        // 需要将这个角度转换为正值并计算对应的扇形索引
        let arrowRelativeAngle = -finalRotation;
        if (arrowRelativeAngle < 0) {
            arrowRelativeAngle += 2 * Math.PI;
        }
        const selectedIndex = Math.floor(arrowRelativeAngle / anglePerSlice) % dishes.length;
        this.selectedDish = dishes[selectedIndex];

        // 设置CSS变量并开始动画
        this.canvas.style.setProperty('--rotation-angle', `${totalRotation}rad`);
        this.canvas.style.setProperty('--spin-duration', '3s');
        this.canvas.classList.add('spinning');

        // 动画结束后的处理
        setTimeout(() => {
            // 移除CSS动画类，但保持最终的transform状态
            this.canvas.classList.remove('spinning');
            // 设置最终的transform状态，确保动画结束后的显示保持一致
            this.canvas.style.transform = `rotate(${totalRotation}rad)`;

            // 更新当前旋转角度（用于后续的canvas绘制）
            this.currentRotation = finalRotation;

            this.isSpinning = false;
            document.getElementById('spinBtn').disabled = false;
            this.showResult();
            this.saveToHistory(this.selectedDish);
            this.saveLastResult(this.selectedDish);
        }, 3000);
    }

    showResult() {
        document.getElementById('resultDish').textContent = this.selectedDish;
        document.getElementById('resultDisplay').style.display = 'block';
        document.getElementById('resultDisplay').scrollIntoView({ behavior: 'smooth' });
    }

    reset() {
        if (this.isSpinning) return;

        this.currentRotation = 0;
        this.canvas.style.transform = 'none';
        this.canvas.classList.remove('spinning');
        document.getElementById('resultDisplay').style.display = 'none';
        this.updateWheel();
    }

    // 自定义菜品功能
    showCustomModal() {
        document.getElementById('customModal').style.display = 'flex';
        this.updateCustomDishesList();
    }

    hideCustomModal() {
        document.getElementById('customModal').style.display = 'none';
    }

    saveCustomDishes() {
        const input = document.getElementById('customDishes').value.trim();
        if (!input) return;

        const dishes = input.split(/[,，\n]/).map(dish => dish.trim()).filter(dish => dish);
        const existing = this.getCustomDishes();
        const combined = [...new Set([...existing, ...dishes])];

        localStorage.setItem('customDishes', JSON.stringify(combined));
        document.getElementById('customDishes').value = '';
        this.updateCustomDishesList();

        if (document.getElementById('cuisine').value === 'custom') {
            this.updateWheel();
        }
    }

    getCustomDishes() {
        const stored = localStorage.getItem('customDishes');
        return stored ? JSON.parse(stored) : [];
    }

    updateCustomDishesList() {
        const dishes = this.getCustomDishes();
        const container = document.getElementById('customDishesList');

        container.innerHTML = dishes.map(dish => `
            <div class="custom-dish-item">
                <span>${dish}</span>
                <button class="delete-dish" onclick="app.deleteCustomDish('${dish}')">删除</button>
            </div>
        `).join('');
    }

    deleteCustomDish(dish) {
        const dishes = this.getCustomDishes().filter(d => d !== dish);
        localStorage.setItem('customDishes', JSON.stringify(dishes));
        this.updateCustomDishesList();

        if (document.getElementById('cuisine').value === 'custom') {
            this.updateWheel();
        }
    }

    // 收藏功能
    addToFavorites() {
        if (!this.selectedDish) return;

        const favorites = this.getFavorites();
        if (!favorites.includes(this.selectedDish)) {
            favorites.push(this.selectedDish);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            this.updateFavoritesList();
        }
    }

    getFavorites() {
        const stored = localStorage.getItem('favorites');
        return stored ? JSON.parse(stored) : [];
    }

    updateFavoritesList() {
        const favorites = this.getFavorites();
        const container = document.getElementById('favoritesList');

        container.innerHTML = favorites.map(dish => `
            <div class="favorite-item">
                <span onclick="app.selectFavoriteDish('${dish}')">${dish}</span>
                <button class="remove-btn" onclick="app.removeFavorite('${dish}')">×</button>
            </div>
        `).join('');
    }

    removeFavorite(dish) {
        const favorites = this.getFavorites().filter(d => d !== dish);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        this.updateFavoritesList();
    }

    selectFavoriteDish(dish) {
        this.selectedDish = dish;
        this.showResult();
        this.saveToHistory(dish);
        this.saveLastResult(dish);
    }

    // 历史记录功能
    saveToHistory(dish) {
        const history = this.getHistory();
        const timestamp = new Date().toLocaleString();
        const entry = { dish, timestamp };

        history.unshift(entry);
        if (history.length > 10) history.pop(); // 只保留最近10条

        localStorage.setItem('history', JSON.stringify(history));
        this.updateHistoryList();
    }

    getHistory() {
        const stored = localStorage.getItem('history');
        return stored ? JSON.parse(stored) : [];
    }

    updateHistoryList() {
        const history = this.getHistory();
        const container = document.getElementById('historyList');

        container.innerHTML = history.map((entry, index) => `
            <div class="history-item">
                <div>
                    <span onclick="app.selectFavoriteDish('${entry.dish}')" style="cursor: pointer;">${entry.dish}</span>
                    <small style="display: block; color: #666; font-size: 11px; margin-top: 2px;">${entry.timestamp}</small>
                </div>
            </div>
        `).join('');
    }

    // 最后结果保存
    saveLastResult(dish) {
        localStorage.setItem('lastResult', dish);
        this.loadLastResult();
    }

    loadLastResult() {
        const lastResult = localStorage.getItem('lastResult');
        const container = document.getElementById('lastResult');

        if (lastResult) {
            container.textContent = `上次抽中：${lastResult}`;
        }
    }

    // 分享功能
    showShareModal() {
        if (!this.selectedDish) return;

        const url = `${window.location.origin}${window.location.pathname}?dish=${encodeURIComponent(this.selectedDish)}`;
        document.getElementById('shareUrl').value = url;
        document.getElementById('shareModal').style.display = 'flex';

        this.generateQRCode(url);
    }

    hideShareModal() {
        document.getElementById('shareModal').style.display = 'none';
    }

    copyShareUrl() {
        const urlInput = document.getElementById('shareUrl');
        urlInput.select();
        document.execCommand('copy');

        const button = document.getElementById('copyUrl');
        const originalText = button.textContent;
        button.textContent = '已复制！';
        setTimeout(() => {
            button.textContent = originalText;
        }, 2000);
    }

    generateQRCode(url) {
        // 简单的二维码生成（实际项目中可使用QRCode.js库）
        const qrContainer = document.getElementById('qrCode');
        qrContainer.innerHTML = `
            <div style="padding: 20px; border: 2px solid #333; text-align: center; font-family: monospace; background: #f8f9fa;">
                扫码或点击链接分享<br>
                <small>${url}</small>
            </div>
        `;
    }

    // URL参数解析
    parseURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const dish = urlParams.get('dish');
        const dishes = urlParams.get('dishes');

        if (dish) {
            this.selectedDish = decodeURIComponent(dish);
            this.showResult();
            // 移除自动添加历史记录，避免分享链接重复添加
            // this.saveToHistory(dish);
        }

        if (dishes) {
            const dishList = decodeURIComponent(dishes).split(',');
            localStorage.setItem('customDishes', JSON.stringify(dishList));
            document.getElementById('cuisine').value = 'custom';
            this.updateWheel();
        }
    }

    // 数据加载
    loadLocalData() {
        // 确保localStorage中有基本数据
        if (!localStorage.getItem('favorites')) {
            localStorage.setItem('favorites', JSON.stringify([]));
        }
        if (!localStorage.getItem('history')) {
            localStorage.setItem('history', JSON.stringify([]));
        }
        if (!localStorage.getItem('customDishes')) {
            localStorage.setItem('customDishes', JSON.stringify([]));
        }
    }
}

// 初始化应用
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new FoodWheelApp();
});