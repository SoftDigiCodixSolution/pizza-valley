import React, { useState } from 'react';
import './PizzaCustomizer.css';

const SIZES = [
  { id:'small',  label:'Small',  inch:'6"',  multiplier:1.0, desc:'Serves 1' },
  { id:'medium', label:'Medium', inch:'9"',  multiplier:1.4, desc:'Serves 2' },
  { id:'large',  label:'Large',  inch:'12"', multiplier:1.8, desc:'Serves 3-4' },
  { id:'family', label:'Family', inch:'15"', multiplier:2.4, desc:'Serves 5-6' },
];

const CRUSTS = [
  { id:'thin',       label:'Thin Crust',      icon:'🫓', price:0,   desc:'Crispy & light' },
  { id:'thick',      label:'Thick Crust',     icon:'🍞', price:50,  desc:'Soft & fluffy' },
  { id:'stuffed',    label:'Stuffed Crust',   icon:'🧀', price:100, desc:'Cheese filled edges' },
  { id:'wholewheat', label:'Whole Wheat',     icon:'🌾', price:80,  desc:'Healthy option' },
];

const SAUCES = [
  { id:'tomato',     label:'Classic Tomato',  icon:'🍅', price:0   },
  { id:'bbq',        label:'BBQ Sauce',       icon:'🔥', price:30  },
  { id:'white',      label:'White Garlic',    icon:'🧄', price:30  },
  { id:'pesto',      label:'Pesto',           icon:'🌿', price:50  },
  { id:'spicy',      label:'Spicy Arrabbiata',icon:'🌶️', price:30  },
];

const CHEESE = [
  { id:'regular', label:'Regular Cheese',  icon:'🧀', price:0   },
  { id:'extra',   label:'Extra Cheese',    icon:'🧀', price:80  },
  { id:'double',  label:'Double Cheese',   icon:'🧀', price:150 },
  { id:'burst',   label:'Cheese Burst',    icon:'🧀', price:200 },
  { id:'none',    label:'No Cheese',       icon:'❌', price:0   },
];

const TOPPINGS = [
  { id:'mushroom',  label:'Mushrooms',    icon:'🍄', price:60 },
  { id:'olive',     label:'Black Olives', icon:'🫒', price:50 },
  { id:'jalapeno',  label:'Jalapeños',    icon:'🌶️', price:50 },
  { id:'corn',      label:'Sweet Corn',   icon:'🌽', price:40 },
  { id:'onion',     label:'Red Onion',    icon:'🧅', price:30 },
  { id:'pepper',    label:'Bell Peppers', icon:'🫑', price:50 },
  { id:'chicken',   label:'Extra Chicken',icon:'🍗', price:100 },
  { id:'beef',      label:'Extra Beef',   icon:'🥩', price:120 },
];

const SPICE = [
  { id:'mild',   label:'Mild',       icon:'😊', color:'#10b981' },
  { id:'medium', label:'Medium',     icon:'😋', color:'#f59e0b' },
  { id:'hot',    label:'Hot',        icon:'🥵', color:'#ef4444' },
  { id:'xhot',   label:'Extra Hot',  icon:'🔥', color:'#dc2626' },
];

export default function PizzaCustomizer({ item, onAddToCart, onClose }) {
  const [size,         setSize]         = useState('medium');
  const [crust,        setCrust]        = useState('thin');
  const [sauce,        setSauce]        = useState('tomato');
  const [cheese,       setCheese]       = useState('regular');
  const [toppings,     setToppings]     = useState([]);
  const [spice,        setSpice]        = useState('medium');
  const [qty,          setQty]          = useState(1);
  const [notes,        setNotes]        = useState('');

  const toggleTopping = (id) => {
    setToppings(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const basePrice    = item.price;
  const sizePrice    = basePrice * (SIZES.find(s => s.id === size)?.multiplier || 1);
  const crustPrice   = CRUSTS.find(c => c.id === crust)?.price || 0;
  const saucePrice   = SAUCES.find(s => s.id === sauce)?.price || 0;
  const cheesePrice  = CHEESE.find(c => c.id === cheese)?.price || 0;
  const toppingPrice = toppings.reduce((a, t) => a + (TOPPINGS.find(tp => tp.id === t)?.price || 0), 0);
  const unitPrice    = Math.round(sizePrice + crustPrice + saucePrice + cheesePrice + toppingPrice);
  const totalPrice   = unitPrice * qty;

  const handleAdd = () => {
    const customizedItem = {
      ...item,
      price        : unitPrice,
      qty,
      customization: {
        size   : SIZES.find(s => s.id === size)?.label,
        crust  : CRUSTS.find(c => c.id === crust)?.label,
        sauce  : SAUCES.find(s => s.id === sauce)?.label,
        cheese : CHEESE.find(c => c.id === cheese)?.label,
        toppings: toppings.map(t => TOPPINGS.find(tp => tp.id === t)?.label),
        spice  : SPICE.find(s => s.id === spice)?.label,
        notes,
      },
      displayName: `${item.name} (${SIZES.find(s=>s.id===size)?.label})`,
      id: `${item.id}_${Date.now()}`,
    };
    onAddToCart(customizedItem);
    onClose();
  };

  return (
    <div className="pc-overlay" onClick={onClose}>
      <div className="pc-modal" onClick={e => e.stopPropagation()}>

        {/* HEADER */}
        <div className="pc-header">
          <div>
            <h2>{item.name}</h2>
            <p>{item.desc}</p>
          </div>
          <button className="pc-close" onClick={onClose}>✕</button>
        </div>

        <div className="pc-body">
          <img src={item.img} alt={item.name} className="pc-pizza-img" />

          {/* SIZE */}
          <div className="pc-section">
            <div className="pc-section-title">📏 Choose Size</div>
            <div className="pc-size-grid">
              {SIZES.map(s => (
                <button key={s.id}
                  className={`pc-size-btn ${size === s.id ? 'active' : ''}`}
                  onClick={() => setSize(s.id)}>
                  <div className="pc-size-inch">{s.inch}</div>
                  <div className="pc-size-label">{s.label}</div>
                  <div className="pc-size-desc">{s.desc}</div>
                  <div className="pc-size-price">
                    Rs. {Math.round(basePrice * s.multiplier).toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* CRUST */}
          <div className="pc-section">
            <div className="pc-section-title">🍞 Choose Crust</div>
            <div className="pc-options-grid">
              {CRUSTS.map(c => (
                <button key={c.id}
                  className={`pc-option-btn ${crust === c.id ? 'active' : ''}`}
                  onClick={() => setCrust(c.id)}>
                  <span className="pc-opt-icon">{c.icon}</span>
                  <span className="pc-opt-label">{c.label}</span>
                  <span className="pc-opt-desc">{c.desc}</span>
                  {c.price > 0 && <span className="pc-opt-price">+Rs. {c.price}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* SAUCE */}
          <div className="pc-section">
            <div className="pc-section-title">🍅 Choose Sauce</div>
            <div className="pc-options-grid">
              {SAUCES.map(s => (
                <button key={s.id}
                  className={`pc-option-btn ${sauce === s.id ? 'active' : ''}`}
                  onClick={() => setSauce(s.id)}>
                  <span className="pc-opt-icon">{s.icon}</span>
                  <span className="pc-opt-label">{s.label}</span>
                  {s.price > 0 && <span className="pc-opt-price">+Rs. {s.price}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* CHEESE */}
          <div className="pc-section">
            <div className="pc-section-title">🧀 Choose Cheese</div>
            <div className="pc-options-grid">
              {CHEESE.map(c => (
                <button key={c.id}
                  className={`pc-option-btn ${cheese === c.id ? 'active' : ''}`}
                  onClick={() => setCheese(c.id)}>
                  <span className="pc-opt-icon">{c.icon}</span>
                  <span className="pc-opt-label">{c.label}</span>
                  {c.price > 0 && <span className="pc-opt-price">+Rs. {c.price}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* TOPPINGS */}
          <div className="pc-section">
            <div className="pc-section-title">🍄 Extra Toppings <span className="pc-multi-badge">Select multiple</span></div>
            <div className="pc-toppings-grid">
              {TOPPINGS.map(t => (
                <button key={t.id}
                  className={`pc-topping-btn ${toppings.includes(t.id) ? 'active' : ''}`}
                  onClick={() => toggleTopping(t.id)}>
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                  <span className="pc-top-price">+Rs. {t.price}</span>
                  {toppings.includes(t.id) && <span className="pc-top-check">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* SPICE LEVEL */}
          <div className="pc-section">
            <div className="pc-section-title">🌶️ Spice Level</div>
            <div className="pc-spice-row">
              {SPICE.map(s => (
                <button key={s.id}
                  className={`pc-spice-btn ${spice === s.id ? 'active' : ''}`}
                  style={spice === s.id ? { borderColor: s.color, background: s.color+'22', color: s.color } : {}}
                  onClick={() => setSpice(s.id)}>
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* SPECIAL INSTRUCTIONS */}
          <div className="pc-section">
            <div className="pc-section-title">📝 Special Instructions</div>
            <textarea
              className="pc-notes"
              placeholder="E.g. No onions, extra crispy, cut into 8 slices..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* QUANTITY */}
          <div className="pc-section">
            <div className="pc-section-title">🔢 Quantity</div>
            <div className="pc-qty-row">
              <button className="pc-qty-btn" onClick={() => setQty(q => Math.max(1, q-1))}>−</button>
              <span className="pc-qty-num">{qty}</span>
              <button className="pc-qty-btn" onClick={() => setQty(q => q+1)}>+</button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pc-footer">
          <div className="pc-price-breakdown">
            <div className="pc-price-row"><span>Base price ({SIZES.find(s=>s.id===size)?.label})</span><span>Rs. {Math.round(sizePrice).toLocaleString()}</span></div>
            {crustPrice  > 0 && <div className="pc-price-row"><span>Crust</span><span>+Rs. {crustPrice}</span></div>}
            {saucePrice  > 0 && <div className="pc-price-row"><span>Sauce</span><span>+Rs. {saucePrice}</span></div>}
            {cheesePrice > 0 && <div className="pc-price-row"><span>Cheese</span><span>+Rs. {cheesePrice}</span></div>}
            {toppingPrice> 0 && <div className="pc-price-row"><span>Toppings ({toppings.length})</span><span>+Rs. {toppingPrice}</span></div>}
            {qty         > 1 && <div className="pc-price-row"><span>× {qty} qty</span><span>Rs. {unitPrice} each</span></div>}
          </div>
          <div className="pc-total-row">
            <span>Total</span>
            <strong>Rs. {totalPrice.toLocaleString()}</strong>
          </div>
          <button className="pc-add-btn" onClick={handleAdd}>
            Add to Cart — Rs. {totalPrice.toLocaleString()} 🍕
          </button>
        </div>

      </div>
    </div>
  );
}