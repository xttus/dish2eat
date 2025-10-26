class FoodWheelApp {
    constructor() {
        this.canvas = document.getElementById('wheelCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.isSpinning = false;
        this.currentRotation = 0;
        this.selectedDish = null;

        // 当前选中的自定义列表
        this.currentCustomList = 'default';

        // 自定义列表数据结构
        this.customLists = {
            'default': {
                name: '默认',
                dishes: []
            }
        };

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
        this.loadImportedData();
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
        document.getElementById('againBtn').addEventListener('click', () => this.againSpin());
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

        // Excel导入事件
        document.getElementById('selectExcelBtn').addEventListener('click', () => this.selectExcelFile());
        document.getElementById('downloadTemplateBtn').addEventListener('click', () => this.downloadTemplate());
        document.getElementById('excelFile').addEventListener('change', (e) => this.handleExcelFile(e));

        // 自定义列表管理事件
        document.getElementById('customListSelector').addEventListener('change', (e) => this.switchCustomList(e.target.value));
        document.getElementById('addListBtn').addEventListener('click', () => this.addNewList());
        document.getElementById('renameListBtn').addEventListener('click', () => this.renameCurrentList());
        document.getElementById('deleteListBtn').addEventListener('click', () => this.deleteCurrentList());

        // 导入模式切换事件
        document.querySelectorAll('input[name="importMode"]').forEach(radio => {
            radio.addEventListener('change', (e) => this.toggleNewListInput(e.target.value));
        });

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

        // 检查是否是自定义列表
        if (cuisine.startsWith('custom:')) {
            const listId = cuisine.replace('custom:', '');
            return this.customLists[listId]?.dishes || [];
        }

        if (this.dishData[mealType] && this.dishData[mealType][cuisine]) {
            return this.dishData[mealType][cuisine];
        }

        // 如果没有对应的菜系，返回混合菜系
        return this.dishData[mealType]?.mixed || ['没有可选菜品'];
    }

    updateWheel() {
        // 切换菜系时重置转盘状态
        this.currentRotation = 0;
        this.canvas.style.transform = 'none';
        this.canvas.classList.remove('spinning');
        document.getElementById('resultDisplay').style.display = 'none';

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

            // 优化字体样式和可读性
            const fontSize = this.canvas.width > 300 ? 16 : 14;
            this.ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
            this.ctx.fillStyle = '#fff';
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 3;
            this.ctx.textAlign = 'left';
            this.ctx.textBaseline = 'middle';

            const textRadius = radius * 0.65;

            // 添加文字描边效果增强可读性
            this.ctx.strokeText(dish, textRadius, 0);
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

        // 先重置转盘到初始位置
        this.currentRotation = 0;
        this.canvas.style.transform = 'none';
        this.canvas.classList.remove('spinning');

        // 随机旋转角度
        const spins = 3 + Math.random() * 3; // 3-6圈
        const finalAngle = Math.random() * 2 * Math.PI;
        const totalRotation = spins * 2 * Math.PI + finalAngle;

        // 计算最终选中的菜品
        const anglePerSlice = (2 * Math.PI) / dishes.length;
        const finalRotation = totalRotation % (2 * Math.PI);

        // 箭头固定在正上方，扇形从正上方开始按顺时针绘制
        // 转盘旋转finalRotation后，计算箭头指向哪个扇形
        // 由于转盘顺时针旋转，箭头相对于转盘是逆时针移动
        let arrowRelativeAngle = (2 * Math.PI - finalRotation) % (2 * Math.PI);
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

        // 重置转盘状态
        this.currentRotation = 0;
        this.canvas.style.transform = 'none';
        this.canvas.classList.remove('spinning');
        document.getElementById('resultDisplay').style.display = 'none';
        this.selectedDish = null;

        // 清空历史记录
        localStorage.setItem('history', JSON.stringify([]));
        this.updateHistoryList();

        // 清空上次结果
        localStorage.removeItem('lastResult');
        document.getElementById('lastResult').textContent = '';

        // 重新绘制转盘
        this.updateWheel();

        // 显示重置成功提示
        this.showSuccessNotification('历史记录已清空！');
    }

    againSpin() {
        if (this.isSpinning) return;

        // 只清空本次抽取结果，不删除历史记录
        this.currentRotation = 0;
        this.canvas.style.transform = 'none';
        this.canvas.classList.remove('spinning');
        document.getElementById('resultDisplay').style.display = 'none';
        this.selectedDish = null;

        // 重新绘制转盘
        this.updateWheel();

        // 显示提示
        this.showSuccessNotification('重新开始抽选！');

        // 延迟一秒后自动开始转盘
        setTimeout(() => {
            this.spin();
        }, 1000);
    }

    // 自定义菜品功能
    showCustomModal() {
        document.getElementById('customModal').style.display = 'flex';
        this.updateCustomListSelector();
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

        this.customLists[this.currentCustomList].dishes = combined;
        this.saveCustomListsToStorage();
        document.getElementById('customDishes').value = '';
        this.updateCustomDishesList();

        if (document.getElementById('cuisine').value === 'custom') {
            this.updateWheel();
        }
    }

    getCustomDishes() {
        return this.customLists[this.currentCustomList]?.dishes || [];
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
        this.customLists[this.currentCustomList].dishes = dishes;
        this.saveCustomListsToStorage();
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

        // 加载自定义列表数据
        this.loadCustomListsFromStorage();
    }

    // 自定义列表管理功能
    loadCustomListsFromStorage() {
        const stored = localStorage.getItem('customLists');
        if (stored) {
            try {
                this.customLists = JSON.parse(stored);
            } catch (error) {
                console.error('加载自定义列表失败:', error);
                this.customLists = {
                    'default': {
                        name: '默认',
                        dishes: []
                    }
                };
            }
        }

        // 兼容旧版本数据
        const oldCustomDishes = localStorage.getItem('customDishes');
        if (oldCustomDishes && !this.customLists.default.dishes.length) {
            try {
                this.customLists.default.dishes = JSON.parse(oldCustomDishes);
                this.saveCustomListsToStorage();
                localStorage.removeItem('customDishes');
            } catch (error) {
                console.error('迁移旧数据失败:', error);
            }
        }

        this.updateCustomListSelector();
    }

    saveCustomListsToStorage() {
        localStorage.setItem('customLists', JSON.stringify(this.customLists));
    }

    updateCustomListSelector() {
        const selector = document.getElementById('customListSelector');
        selector.innerHTML = '';

        Object.keys(this.customLists).forEach(listId => {
            const option = document.createElement('option');
            option.value = listId;
            option.textContent = this.customLists[listId].name;
            if (listId === this.currentCustomList) {
                option.selected = true;
            }
            selector.appendChild(option);
        });

        // 同时更新主菜系选择器中的自定义列表
        this.updateCuisineSelector();
    }

    updateCuisineSelector() {
        const cuisineSelector = document.getElementById('cuisine');
        const customListsGroup = document.getElementById('customListsGroup');

        // 清空自定义列表组
        customListsGroup.innerHTML = '';

        // 添加所有自定义列表到菜系选择器
        Object.keys(this.customLists).forEach(listId => {
            const option = document.createElement('option');
            option.value = `custom:${listId}`;
            option.textContent = this.customLists[listId].name;
            customListsGroup.appendChild(option);
        });
    }

    switchCustomList(listId) {
        if (this.customLists[listId]) {
            this.currentCustomList = listId;
            this.updateCustomDishesList();

            if (document.getElementById('cuisine').value === 'custom') {
                this.updateWheel();
            }
        }
    }

    addNewList() {
        const name = prompt('请输入新列表名称:');
        if (!name || !name.trim()) return;

        const listId = 'list_' + Date.now();
        this.customLists[listId] = {
            name: name.trim(),
            dishes: []
        };

        this.saveCustomListsToStorage();
        this.updateCustomListSelector();
        this.switchCustomList(listId);
        this.showSuccessNotification(`成功创建列表"${name.trim()}"！`);
    }

    renameCurrentList() {
        if (this.currentCustomList === 'default') {
            alert('默认列表不能重命名！');
            return;
        }

        const currentName = this.customLists[this.currentCustomList].name;
        const newName = prompt('请输入新的列表名称:', currentName);
        if (!newName || !newName.trim() || newName.trim() === currentName) return;

        this.customLists[this.currentCustomList].name = newName.trim();
        this.saveCustomListsToStorage();
        this.updateCustomListSelector();
        this.showSuccessNotification(`列表已重命名为"${newName.trim()}"！`);
    }

    deleteCurrentList() {
        if (this.currentCustomList === 'default') {
            alert('默认列表不能删除！');
            return;
        }

        const listName = this.customLists[this.currentCustomList].name;
        if (!confirm(`确定要删除列表"${listName}"吗？此操作不可恢复！`)) return;

        delete this.customLists[this.currentCustomList];
        this.saveCustomListsToStorage();

        // 切换到默认列表
        this.currentCustomList = 'default';
        this.updateCustomListSelector();
        this.updateCustomDishesList();

        if (document.getElementById('cuisine').value === 'custom') {
            this.updateWheel();
        }

        this.showSuccessNotification(`列表"${listName}"已删除！`);
    }

    toggleNewListInput(mode) {
        const newListInput = document.getElementById('newListNameInput');
        if (mode === 'newlist') {
            newListInput.style.display = 'block';
        } else {
            newListInput.style.display = 'none';
        }
    }

    // Excel导入功能
    selectExcelFile() {
        document.getElementById('excelFile').click();
    }

    downloadTemplate() {
        // 创建Excel模板数据
        const templateData = [
            ['餐饮类型', '菜系', '菜品名称'],
            ['lunch', 'sichuan', '麻婆豆腐'],
            ['lunch', 'sichuan', '水煮鱼'],
            ['lunch', 'cantonese', '白切鸡'],
            ['dinner', 'western', '牛排'],
            ['breakfast', 'mixed', '豆浆油条'],
            ['snack', 'mixed', '奶茶'],
            ['drink', 'mixed', '咖啡']
        ];

        // 创建工作簿
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(templateData);

        // 设置列宽
        ws['!cols'] = [
            { width: 15 },
            { width: 15 },
            { width: 20 }
        ];

        XLSX.utils.book_append_sheet(wb, ws, '菜品模板');

        // 下载文件
        XLSX.writeFile(wb, '菜品导入模板.xlsx');

        this.showImportStatus('模板下载成功！', 'success');
    }

    handleExcelFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                // 读取第一个工作表
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                // 转换为JSON数组
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                this.processExcelData(jsonData);
            } catch (error) {
                console.error('Excel文件解析错误:', error);
                this.showImportStatus('Excel文件格式错误，请检查文件格式！', 'error');
            }
        };

        reader.readAsArrayBuffer(file);

        // 清空文件输入
        event.target.value = '';
    }

    processExcelData(data) {
        if (!data || data.length < 2) {
            this.showImportStatus('Excel文件内容为空或格式不正确！', 'error');
            return;
        }

        // 跳过标题行，从第二行开始处理
        const dishRows = data.slice(1);
        const validDishes = [];
        const errors = [];

        // 验证数据格式
        dishRows.forEach((row, index) => {
            const rowNum = index + 2; // 实际行号（从2开始）

            if (!row || row.length < 3) {
                errors.push(`第${rowNum}行：数据不完整`);
                return;
            }

            const [mealType, cuisine, dishName] = row;

            // 验证餐饮类型
            const validMealTypes = ['breakfast', 'lunch', 'dinner', 'snack', 'drink', 'nightFood'];
            if (!validMealTypes.includes(mealType)) {
                errors.push(`第${rowNum}行：餐饮类型"${mealType}"无效`);
                return;
            }

            // 验证菜系
            const validCuisines = ['mixed', 'sichuan', 'cantonese', 'hunan', 'western', 'japanese', 'korean'];
            if (!validCuisines.includes(cuisine)) {
                errors.push(`第${rowNum}行：菜系"${cuisine}"无效`);
                return;
            }

            // 验证菜品名称
            if (!dishName || dishName.toString().trim() === '') {
                errors.push(`第${rowNum}行：菜品名称不能为空`);
                return;
            }

            validDishes.push({
                mealType: mealType.toString().trim(),
                cuisine: cuisine.toString().trim(),
                dishName: dishName.toString().trim()
            });
        });

        if (errors.length > 0) {
            this.showImportStatus(`导入失败：\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? '\n...' : ''}`, 'error');
            return;
        }

        if (validDishes.length === 0) {
            this.showImportStatus('没有找到有效的菜品数据！', 'error');
            return;
        }

        // 获取导入模式
        const importMode = document.querySelector('input[name="importMode"]:checked').value;

        this.importDishesToData(validDishes, importMode);
    }

    importDishesToData(dishes, mode) {
        try {
            let targetListId = this.currentCustomList;
            let modeText = '';

            if (mode === 'newlist') {
                // 创建新列表模式
                const newListName = document.getElementById('newListName').value.trim();
                if (!newListName) {
                    this.showImportStatus('请输入新列表名称！', 'error');
                    return;
                }

                targetListId = 'list_' + Date.now();
                this.customLists[targetListId] = {
                    name: newListName,
                    dishes: []
                };
                modeText = `创建新列表"${newListName}"并导入`;
            } else if (mode === 'replace') {
                // 替换当前列表
                this.customLists[targetListId].dishes = [];
                modeText = '替换当前列表并导入';
            } else {
                // 追加到当前列表
                modeText = '追加到当前列表';
            }

            // 提取菜品名称并添加到目标列表
            const dishNames = dishes.map(dish => dish.dishName);
            const existing = this.customLists[targetListId].dishes;
            const combined = [...new Set([...existing, ...dishNames])];

            this.customLists[targetListId].dishes = combined;
            this.saveCustomListsToStorage();

            // 如果创建了新列表，切换到新列表
            if (mode === 'newlist') {
                this.updateCustomListSelector();
                this.switchCustomList(targetListId);
                document.getElementById('newListName').value = '';
                document.getElementById('newListNameInput').style.display = 'none';
                document.querySelector('input[name="importMode"][value="append"]').checked = true;
            } else {
                this.updateCustomDishesList();
            }

            // 如果当前选择的是自定义菜系，更新转盘
            if (document.getElementById('cuisine').value === 'custom') {
                this.updateWheel();
            }

            this.showImportStatus(`成功${modeText} ${dishNames.length} 个菜品！`, 'success');

        } catch (error) {
            console.error('导入数据时出错:', error);
            this.showImportStatus('导入数据时发生错误，请重试！', 'error');
        }
    }

    showImportStatus(message, type) {
        const statusDiv = document.getElementById('importStatus');
        statusDiv.textContent = message;
        statusDiv.className = `import-status ${type}`;

        if (type === 'success') {
            // 显示成功提示
            this.showSuccessNotification(message);
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 3000);
        }
    }

    showSuccessNotification(message) {
        // 创建成功提示元素
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">✅</span>
                <span class="notification-text">${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // 显示动画
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // 自动隐藏
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // 在应用初始化时加载导入的数据
    loadImportedData() {
        const importedData = localStorage.getItem('importedDishes');
        if (importedData) {
            try {
                this.dishData = JSON.parse(importedData);
            } catch (error) {
                console.error('加载导入数据失败:', error);
            }
        }
    }
}

// 初始化应用
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new FoodWheelApp();
});