import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Image, TextInput, StyleSheet, SafeAreaView,
  StatusBar, FlatList, Alert
} from 'react-native';

// ── DATA ──
const MENU = [
  { id:1, name:'Margherita Classic', category:'Classic', price:850,  badge:'Bestseller',
    img:'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80',
    desc:'San Marzano tomatoes, fresh mozzarella, basil oil' },
  { id:2, name:'BBQ Smoky Chicken',  category:'Chicken', price:1100, badge:'Hot',
    img:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80',
    desc:'Smoked chicken, caramelized onions, BBQ drizzle' },
  { id:3, name:'Pepperoni Feast',    category:'Beef',    price:1250, badge:'Popular',
    img:'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80',
    desc:'Double pepperoni, cheese burst crust, oregano' },
  { id:4, name:'Veggie Supreme',     category:'Veggie',  price:950,  badge:'',
    img:'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80',
    desc:'Bell peppers, mushrooms, olives, sun-dried tomato' },
  { id:5, name:'Spicy Tikka',        category:'Chicken', price:1150, badge:'Spicy 🌶',
    img:'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=400&q=80',
    desc:'Tikka chicken, green chilli, mint chutney base' },
  { id:6, name:'Cheese Overload',    category:'Classic', price:1300, badge:'New',
    img:'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&q=80',
    desc:'Four cheese blend, truffle oil, crispy garlic' },
];

const CATS = ['All', 'Classic', 'Chicken', 'Beef', 'Veggie'];

const DEALS = [
  { id:1, title:'Family Feast',  desc:'2 Large + 4 Drinks + Bread', price:2999, original:4200, tag:'28% OFF' },
  { id:2, title:'Date Night',    desc:'1 Large + 2 Drinks + Dessert', price:1599, original:2100, tag:'24% OFF' },
  { id:3, title:'Solo Deal',     desc:'1 Medium + 1 Drink + Fries',  price:899,  original:1300, tag:'30% OFF' },
];

// ── COLORS ──
const C = {
  bg     : '#0d0d0d',
  card   : '#1a1a1a',
  card2  : '#242424',
  orange : '#ff6b35',
  white  : '#ffffff',
  gray   : '#888888',
  border : 'rgba(255,255,255,0.08)',
  green  : '#10b981',
};

// ── SCREENS ──

function HomeScreen({ setScreen, cart, addToCart }) {
  const [cat, setCat] = useState('All');
  const filtered = cat === 'All' ? MENU : MENU.filter(i => i.category === cat);
  const cartCount = cart.reduce((a, b) => a + b.qty, 0);

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={s.header}>
          <View>
            <Text style={s.headerSub}>Welcome to</Text>
            <Text style={s.headerTitle}>🍕 Pizza Valley</Text>
          </View>
          <TouchableOpacity style={s.cartBtn} onPress={() => setScreen('cart')}>
            <Text style={s.cartIcon}>🛒</Text>
            {cartCount > 0 && (
              <View style={s.cartBadge}>
                <Text style={s.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* HERO */}
        <View style={s.hero}>
          <Image
            source={{ uri:'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=90' }}
            style={s.heroImg}
          />
          <View style={s.heroOverlay}>
            <Text style={s.heroBadge}>🔥 Delivered in 30 mins</Text>
            <Text style={s.heroTitle}>Authentic{'\n'}Stone Fired Pizza</Text>
            <TouchableOpacity style={s.heroBtn} onPress={() => setScreen('menu')}>
              <Text style={s.heroBtnText}>Order Now →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* STATS */}
        <View style={s.statsRow}>
          {[
            { val:'50K+', lbl:'Customers' },
            { val:'4.9★', lbl:'Rating' },
            { val:'30m',  lbl:'Delivery' },
          ].map((st, i) => (
            <View key={i} style={s.statItem}>
              <Text style={s.statVal}>{st.val}</Text>
              <Text style={s.statLbl}>{st.lbl}</Text>
            </View>
          ))}
        </View>

        {/* CATEGORIES */}
        <Text style={s.sectionTitle}>Our Menu</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catScroll}>
          {CATS.map(c => (
            <TouchableOpacity
              key={c}
              style={[s.catBtn, cat === c && s.catBtnActive]}
              onPress={() => setCat(c)}
            >
              <Text style={[s.catBtnText, cat === c && s.catBtnTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* MENU GRID */}
        <View style={s.menuGrid}>
          {filtered.map(item => (
            <View key={item.id} style={s.menuCard}>
              {item.badge ? <View style={s.badge}><Text style={s.badgeText}>{item.badge}</Text></View> : null}
              <Image source={{ uri: item.img }} style={s.menuImg} />
              <View style={s.menuInfo}>
                <Text style={s.menuName}>{item.name}</Text>
                <Text style={s.menuDesc} numberOfLines={2}>{item.desc}</Text>
                <View style={s.menuFooter}>
                  <Text style={s.menuPrice}>Rs. {item.price.toLocaleString()}</Text>
                  <TouchableOpacity style={s.addBtn} onPress={() => addToCart(item)}>
                    <Text style={s.addBtnText}>+ Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* DEALS */}
        <Text style={s.sectionTitle}>Today's Deals</Text>
        {DEALS.map(deal => (
          <View key={deal.id} style={s.dealCard}>
            <View style={s.dealTag}><Text style={s.dealTagText}>{deal.tag}</Text></View>
            <View style={s.dealInfo}>
              <Text style={s.dealTitle}>{deal.title}</Text>
              <Text style={s.dealDesc}>{deal.desc}</Text>
              <View style={s.dealPriceRow}>
                <Text style={s.dealOriginal}>Rs. {deal.original.toLocaleString()}</Text>
                <Text style={s.dealPrice}>Rs. {deal.price.toLocaleString()}</Text>
              </View>
              <TouchableOpacity style={s.dealBtn}>
                <Text style={s.dealBtnText}>Order This Deal</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function CartScreen({ cart, setScreen, updateQty, removeFromCart }) {
  const total    = cart.reduce((a, b) => a + b.price * b.qty, 0);
  const delivery = 150;

  if (cart.length === 0) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => setScreen('home')}>
            <Text style={s.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={s.screenTitle}>Your Cart</Text>
          <View />
        </View>
        <View style={s.emptyCart}>
          <Text style={{ fontSize:60 }}>🍕</Text>
          <Text style={s.emptyText}>Your cart is empty</Text>
          <TouchableOpacity style={s.heroBtn} onPress={() => setScreen('home')}>
            <Text style={s.heroBtnText}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => setScreen('home')}>
          <Text style={s.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={s.screenTitle}>Your Cart ({cart.length})</Text>
        <View />
      </View>
      <ScrollView style={s.scroll}>
        {cart.map(item => (
          <View key={item.id} style={s.cartItem}>
            <Image source={{ uri: item.img }} style={s.cartItemImg} />
            <View style={{ flex:1 }}>
              <Text style={s.cartItemName}>{item.name}</Text>
              <Text style={s.cartItemPrice}>Rs. {item.price.toLocaleString()}</Text>
            </View>
            <View style={s.qtyRow}>
              <TouchableOpacity style={s.qtyBtn} onPress={() => updateQty(item.id, item.qty - 1)}>
                <Text style={s.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={s.qtyNum}>{item.qty}</Text>
              <TouchableOpacity style={s.qtyBtn} onPress={() => updateQty(item.id, item.qty + 1)}>
                <Text style={s.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={s.summaryBox}>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Subtotal</Text>
            <Text style={s.summaryVal}>Rs. {total.toLocaleString()}</Text>
          </View>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Delivery</Text>
            <Text style={s.summaryVal}>Rs. {delivery}</Text>
          </View>
          <View style={[s.summaryRow, { borderTopWidth:1, borderTopColor:C.border, paddingTop:12, marginTop:8 }]}>
            <Text style={[s.summaryLabel, { color:C.white, fontWeight:'700' }]}>Total</Text>
            <Text style={[s.summaryVal, { color:C.orange, fontSize:20, fontWeight:'700' }]}>
              Rs. {(total + delivery).toLocaleString()}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={[s.heroBtn, { margin:16 }]} onPress={() => setScreen('checkout')}>
          <Text style={s.heroBtnText}>Proceed to Checkout →</Text>
        </TouchableOpacity>
        <View style={{ height:40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function CheckoutScreen({ cart, setScreen, clearCart }) {
  const [form, setForm]   = useState({ name:'', phone:'', address:'', city:'Rawalpindi' });
  const [payment, setPayment] = useState('cod');
  const [done, setDone]   = useState(false);
  const total    = cart.reduce((a, b) => a + b.price * b.qty, 0) + 150;

  const placeOrder = () => {
    if (!form.name || !form.phone || !form.address) {
      Alert.alert('Missing Info', 'Please fill all delivery fields');
      return;
    }
    setDone(true);
    clearCart();
  };

  if (done) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.confirmScreen}>
          <Text style={{ fontSize:70 }}>🎉</Text>
          <Text style={s.confirmTitle}>Order Placed!</Text>
          <Text style={s.confirmSub}>Your pizza is being prepared</Text>
          <View style={s.orderIdBox}>
            <Text style={s.orderId}>Order #PV{Math.floor(Math.random()*90000+10000)}</Text>
          </View>
          <Text style={s.etaText}>⏱ Estimated: 25-35 minutes</Text>
          <TouchableOpacity style={[s.heroBtn, { marginTop:24 }]} onPress={() => setScreen('home')}>
            <Text style={s.heroBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => setScreen('cart')}>
          <Text style={s.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={s.screenTitle}>Checkout</Text>
        <View />
      </View>
      <ScrollView style={s.scroll}>
        <Text style={s.sectionTitle}>Delivery Info</Text>
        {[
          { key:'name',    label:'Full Name',    placeholder:'Your full name' },
          { key:'phone',   label:'Phone',        placeholder:'03XX-XXXXXXX' },
          { key:'address', label:'Address',      placeholder:'Street, Area, Landmark' },
        ].map(f => (
          <View key={f.key} style={s.inputBox}>
            <Text style={s.inputLabel}>{f.label}</Text>
            <TextInput
              style={s.input}
              placeholder={f.placeholder}
              placeholderTextColor={C.gray}
              value={form[f.key]}
              onChangeText={v => setForm({ ...form, [f.key]: v })}
            />
          </View>
        ))}

        <Text style={s.sectionTitle}>Payment Method</Text>
        {[
          { id:'cod',       icon:'💵', label:'Cash on Delivery' },
          { id:'jazzcash',  icon:'📱', label:'JazzCash' },
          { id:'easypaisa', icon:'📲', label:'Easypaisa' },
          { id:'card',      icon:'💳', label:'Credit/Debit Card' },
        ].map(p => (
          <TouchableOpacity
            key={p.id}
            style={[s.payOption, payment === p.id && s.payOptionActive]}
            onPress={() => setPayment(p.id)}
          >
            <Text style={{ fontSize:22 }}>{p.icon}</Text>
            <Text style={[s.payLabel, payment === p.id && { color:C.orange }]}>{p.label}</Text>
            <View style={[s.radio, payment === p.id && s.radioActive]}>
              {payment === p.id && <Text style={{ color:'#fff', fontSize:12 }}>✓</Text>}
            </View>
          </TouchableOpacity>
        ))}

        <View style={s.summaryBox}>
          <View style={[s.summaryRow, { borderTopWidth:0 }]}>
            <Text style={[s.summaryLabel, { color:C.white, fontWeight:'700' }]}>Grand Total</Text>
            <Text style={[s.summaryVal, { color:C.orange, fontSize:20, fontWeight:'700' }]}>
              Rs. {total.toLocaleString()}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={[s.heroBtn, { margin:16 }]} onPress={placeOrder}>
          <Text style={s.heroBtnText}>
            {payment === 'cod' ? '✅ Place Order — Pay on Delivery' : `💳 Pay Rs. ${total.toLocaleString()}`}
          </Text>
        </TouchableOpacity>
        <View style={{ height:40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileScreen({ setScreen }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [form, setForm] = useState({ email:'', password:'' });

  if (loggedIn) {
    return (
      <SafeAreaView style={s.safe}>
        <ScrollView style={s.scroll}>
          <View style={s.profileHeader}>
            <View style={s.profileAvatar}><Text style={{ fontSize:32, color:'#fff' }}>A</Text></View>
            <Text style={s.profileName}>Ahmed Raza</Text>
            <Text style={s.profileEmail}>ahmed@email.com</Text>
          </View>
          {[
            { icon:'📦', label:'My Orders' },
            { icon:'📍', label:'Saved Addresses' },
            { icon:'💳', label:'Payment Methods' },
            { icon:'⭐', label:'Loyalty Points — 250 pts' },
            { icon:'🔔', label:'Notifications' },
            { icon:'⚙️', label:'Settings' },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={s.profileItem}>
              <Text style={{ fontSize:20 }}>{item.icon}</Text>
              <Text style={s.profileItemLabel}>{item.label}</Text>
              <Text style={{ color:C.gray }}>›</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={s.logoutBtn} onPress={() => setLoggedIn(false)}>
            <Text style={s.logoutText}>🚪 Logout</Text>
          </TouchableOpacity>
          <View style={{ height:80 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView style={s.scroll}>
        <View style={{ padding:24 }}>
          <Text style={s.headerTitle}>🍕 Pizza Valley</Text>
          <Text style={[s.sectionTitle, { marginTop:24 }]}>Login</Text>
          <View style={s.inputBox}>
            <Text style={s.inputLabel}>Email</Text>
            <TextInput style={s.input} placeholder="you@email.com"
              placeholderTextColor={C.gray} value={form.email}
              onChangeText={v => setForm({...form, email:v})} />
          </View>
          <View style={s.inputBox}>
            <Text style={s.inputLabel}>Password</Text>
            <TextInput style={s.input} placeholder="••••••••"
              placeholderTextColor={C.gray} secureTextEntry value={form.password}
              onChangeText={v => setForm({...form, password:v})} />
          </View>
          <TouchableOpacity style={[s.heroBtn, { marginTop:8 }]} onPress={() => setLoggedIn(true)}>
            <Text style={s.heroBtnText}>Login →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.heroBtn, { marginTop:12, backgroundColor:C.card2 }]}>
            <Text style={[s.heroBtnText, { color:C.orange }]}>Create Account</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height:80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── BOTTOM NAV ──
function BottomNav({ screen, setScreen, cartCount }) {
  const tabs = [
    { id:'home',     icon:'🏠', label:'Home' },
    { id:'menu',     icon:'🍕', label:'Menu' },
    { id:'cart',     icon:'🛒', label:'Cart' },
    { id:'profile',  icon:'👤', label:'Profile' },
  ];
  return (
    <View style={s.bottomNav}>
      {tabs.map(t => (
        <TouchableOpacity key={t.id} style={s.tabItem} onPress={() => setScreen(t.id)}>
          <View>
            <Text style={s.tabIcon}>{t.icon}</Text>
            {t.id === 'cart' && cartCount > 0 && (
              <View style={s.tabBadge}><Text style={s.tabBadgeText}>{cartCount}</Text></View>
            )}
          </View>
          <Text style={[s.tabLabel, screen === t.id && { color: C.orange }]}>{t.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── MAIN APP ──
export default function App() {
  const [screen, setScreen] = useState('home');
  const [cart, setCart]     = useState([]);

  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(c => c.id === item.id);
      if (exists) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id, qty) => {
    if (qty < 1) { setCart(prev => prev.filter(c => c.id !== id)); return; }
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty } : c));
  };

  const clearCart = () => setCart([]);
  const cartCount = cart.reduce((a, b) => a + b.qty, 0);

  return (
    <View style={{ flex:1, backgroundColor: C.bg }}>
      {screen === 'home'     && <HomeScreen     setScreen={setScreen} cart={cart} addToCart={addToCart} />}
      {screen === 'menu'     && <HomeScreen     setScreen={setScreen} cart={cart} addToCart={addToCart} />}
      {screen === 'cart'     && <CartScreen     cart={cart} setScreen={setScreen} updateQty={updateQty} removeFromCart={(id) => setCart(prev => prev.filter(c => c.id !== id))} />}
      {screen === 'checkout' && <CheckoutScreen cart={cart} setScreen={setScreen} clearCart={clearCart} />}
      {screen === 'profile'  && <ProfileScreen  setScreen={setScreen} />}
      {screen !== 'checkout' && (
        <BottomNav screen={screen} setScreen={setScreen} cartCount={cartCount} />
      )}
    </View>
  );
}

// ── STYLES ──
const s = StyleSheet.create({
  safe        : { flex:1, backgroundColor: C.bg },
  scroll      : { flex:1, backgroundColor: C.bg },
  header      : { flexDirection:'row', justifyContent:'space-between', alignItems:'center',
                  padding:16, backgroundColor: C.bg },
  headerSub   : { fontSize:12, color: C.gray, fontWeight:'400' },
  headerTitle : { fontSize:22, color: C.orange, fontWeight:'700' },
  screenTitle : { fontSize:18, color: C.white, fontWeight:'600' },
  backBtn     : { color: C.orange, fontSize:15, fontWeight:'500' },

  cartBtn     : { position:'relative', width:40, height:40, borderRadius:20,
                  backgroundColor:'rgba(255,255,255,0.08)',
                  alignItems:'center', justifyContent:'center' },
  cartIcon    : { fontSize:18 },
  cartBadge   : { position:'absolute', top:-4, right:-4, backgroundColor: C.orange,
                  borderRadius:10, width:18, height:18, alignItems:'center', justifyContent:'center' },
  cartBadgeText: { color:'#fff', fontSize:10, fontWeight:'700' },

  hero        : { margin:16, borderRadius:20, overflow:'hidden', height:200 },
  heroImg     : { width:'100%', height:'100%', position:'absolute' },
  heroOverlay : { flex:1, backgroundColor:'rgba(0,0,0,0.5)', padding:20, justifyContent:'flex-end' },
  heroBadge   : { color: C.orange, fontSize:12, fontWeight:'600', marginBottom:6,
                  backgroundColor:'rgba(255,107,53,0.15)', paddingHorizontal:10,
                  paddingVertical:4, borderRadius:20, alignSelf:'flex-start' },
  heroTitle   : { fontSize:24, color: C.white, fontWeight:'800', marginBottom:12 },
  heroBtn     : { backgroundColor: C.orange, paddingVertical:12, paddingHorizontal:24,
                  borderRadius:25, alignItems:'center' },
  heroBtnText : { color:'#fff', fontSize:15, fontWeight:'600' },

  statsRow    : { flexDirection:'row', margin:16, backgroundColor: C.card,
                  borderRadius:16, padding:16, justifyContent:'space-around' },
  statItem    : { alignItems:'center' },
  statVal     : { fontSize:20, color: C.white, fontWeight:'700' },
  statLbl     : { fontSize:11, color: C.gray, marginTop:2 },

  sectionTitle: { fontSize:18, color: C.white, fontWeight:'700', marginHorizontal:16, marginTop:20, marginBottom:12 },

  catScroll   : { paddingLeft:16, marginBottom:12 },
  catBtn      : { backgroundColor: C.card, borderRadius:20, paddingVertical:8,
                  paddingHorizontal:18, marginRight:8, borderWidth:1, borderColor: C.border },
  catBtnActive: { backgroundColor: C.orange, borderColor: C.orange },
  catBtnText  : { color: C.gray, fontSize:13, fontWeight:'500' },
  catBtnTextActive: { color:'#fff' },

  menuGrid    : { flexDirection:'row', flexWrap:'wrap', paddingHorizontal:8 },
  menuCard    : { width:'48%', margin:'1%', backgroundColor: C.card,
                  borderRadius:16, overflow:'hidden', borderWidth:1, borderColor: C.border },
  badge       : { position:'absolute', top:8, left:8, backgroundColor: C.orange,
                  paddingHorizontal:8, paddingVertical:3, borderRadius:10, zIndex:1 },
  badgeText   : { color:'#fff', fontSize:10, fontWeight:'700' },
  menuImg     : { width:'100%', height:120 },
  menuInfo    : { padding:10 },
  menuName    : { fontSize:13, color: C.white, fontWeight:'600', marginBottom:4 },
  menuDesc    : { fontSize:11, color: C.gray, marginBottom:8, lineHeight:16 },
  menuFooter  : { flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  menuPrice   : { fontSize:14, color: C.orange, fontWeight:'700' },
  addBtn      : { backgroundColor:'rgba(255,107,53,0.15)', borderWidth:1,
                  borderColor:'rgba(255,107,53,0.3)', paddingVertical:5,
                  paddingHorizontal:12, borderRadius:12 },
  addBtnText  : { color: C.orange, fontSize:12, fontWeight:'600' },

  dealCard    : { margin:16, backgroundColor: C.card, borderRadius:16, overflow:'hidden',
                  borderWidth:1, borderColor: C.border },
  dealTag     : { backgroundColor: C.orange, paddingVertical:4, paddingHorizontal:12,
                  alignSelf:'flex-start', borderBottomRightRadius:12, margin:0 },
  dealTagText : { color:'#fff', fontSize:12, fontWeight:'700' },
  dealInfo    : { padding:16 },
  dealTitle   : { fontSize:18, color: C.white, fontWeight:'700', marginBottom:4 },
  dealDesc    : { fontSize:13, color: C.gray, marginBottom:10 },
  dealPriceRow: { flexDirection:'row', alignItems:'center', gap:12, marginBottom:12 },
  dealOriginal: { fontSize:14, color: C.gray, textDecorationLine:'line-through' },
  dealPrice   : { fontSize:22, color: C.orange, fontWeight:'800' },
  dealBtn     : { backgroundColor: C.orange, paddingVertical:12, borderRadius:20, alignItems:'center' },
  dealBtnText : { color:'#fff', fontSize:14, fontWeight:'600' },

  cartItem    : { flexDirection:'row', alignItems:'center', gap:12, margin:12,
                  padding:12, backgroundColor: C.card, borderRadius:14,
                  borderWidth:1, borderColor: C.border },
  cartItemImg : { width:56, height:56, borderRadius:10 },
  cartItemName: { fontSize:13, color: C.white, fontWeight:'600', marginBottom:4 },
  cartItemPrice: { fontSize:13, color: C.orange, fontWeight:'600' },
  qtyRow      : { flexDirection:'row', alignItems:'center', gap:8 },
  qtyBtn      : { width:28, height:28, borderRadius:14,
                  backgroundColor:'rgba(255,255,255,0.08)',
                  alignItems:'center', justifyContent:'center' },
  qtyBtnText  : { color: C.white, fontSize:16, fontWeight:'600' },
  qtyNum      : { color: C.white, fontSize:14, fontWeight:'600', minWidth:20, textAlign:'center' },

  summaryBox  : { margin:16, backgroundColor: C.card, borderRadius:14,
                  padding:16, borderWidth:1, borderColor: C.border },
  summaryRow  : { flexDirection:'row', justifyContent:'space-between', paddingVertical:6 },
  summaryLabel: { fontSize:13, color: C.gray },
  summaryVal  : { fontSize:13, color: C.white },

  emptyCart   : { flex:1, alignItems:'center', justifyContent:'center', gap:16 },
  emptyText   : { fontSize:16, color: C.gray },

  inputBox    : { marginHorizontal:16, marginBottom:14 },
  inputLabel  : { fontSize:13, color: C.gray, fontWeight:'500', marginBottom:6 },
  input       : { backgroundColor: C.card, borderWidth:1, borderColor: C.border,
                  borderRadius:12, padding:14, fontSize:14, color: C.white },

  payOption   : { flexDirection:'row', alignItems:'center', gap:14, margin:16,
                  marginBottom:0, padding:14, backgroundColor: C.card,
                  borderRadius:14, borderWidth:1.5, borderColor: C.border },
  payOptionActive: { borderColor: C.orange, backgroundColor:'rgba(255,107,53,0.05)' },
  payLabel    : { flex:1, fontSize:14, color: C.white, fontWeight:'500' },
  radio       : { width:22, height:22, borderRadius:11, borderWidth:2,
                  borderColor:'rgba(255,255,255,0.2)', alignItems:'center', justifyContent:'center' },
  radioActive : { backgroundColor: C.orange, borderColor: C.orange },

  confirmScreen: { flex:1, alignItems:'center', justifyContent:'center', padding:24, backgroundColor: C.bg },
  confirmTitle : { fontSize:28, color: C.white, fontWeight:'800', marginTop:16, marginBottom:8 },
  confirmSub   : { fontSize:15, color: C.gray, marginBottom:24 },
  orderIdBox   : { backgroundColor:'rgba(255,107,53,0.1)', borderWidth:1,
                   borderColor:'rgba(255,107,53,0.3)', paddingVertical:10,
                   paddingHorizontal:24, borderRadius:30 },
  orderId      : { color: C.orange, fontSize:16, fontWeight:'700' },
  etaText      : { fontSize:14, color: C.gray, marginTop:16 },

  profileHeader: { alignItems:'center', padding:32, backgroundColor: C.card,
                   marginBottom:8 },
  profileAvatar: { width:72, height:72, borderRadius:36, backgroundColor: C.orange,
                   alignItems:'center', justifyContent:'center', marginBottom:12 },
  profileName  : { fontSize:20, color: C.white, fontWeight:'700' },
  profileEmail : { fontSize:13, color: C.gray, marginTop:4 },
  profileItem  : { flexDirection:'row', alignItems:'center', gap:14, padding:16,
                   borderBottomWidth:1, borderBottomColor: C.border },
  profileItemLabel: { flex:1, fontSize:14, color: C.white },
  logoutBtn    : { margin:16, padding:14, backgroundColor:'rgba(239,68,68,0.1)',
                   borderRadius:12, alignItems:'center', borderWidth:1,
                   borderColor:'rgba(239,68,68,0.2)' },
  logoutText   : { color:'#ef4444', fontSize:14, fontWeight:'600' },

  bottomNav   : { flexDirection:'row', backgroundColor:'#111', borderTopWidth:1,
                  borderTopColor: C.border, paddingBottom:20, paddingTop:10 },
  tabItem     : { flex:1, alignItems:'center', position:'relative' },
  tabIcon     : { fontSize:22 },
  tabLabel    : { fontSize:10, color: C.gray, marginTop:3, fontWeight:'500' },
  tabBadge    : { position:'absolute', top:-4, right:-6, backgroundColor: C.orange,
                  borderRadius:8, width:16, height:16, alignItems:'center', justifyContent:'center' },
  tabBadgeText: { color:'#fff', fontSize:9, fontWeight:'700' },
});