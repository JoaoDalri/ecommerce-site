'use client'
import { motion } from 'framer-motion'

const items = [
    { icon: "🚀", title: "Frete Turbo", desc: "Entrega em até 24h" },
    { icon: "🛡️", title: "Garantia Total", desc: "12 meses inclusos" },
    { icon: "💳", title: "Pagamento Flex", desc: "Até 12x sem juros" },
    { icon: "🔄", title: "Troca Fácil", desc: "30 dias para testar" },
]

export default function TrustBar() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-16">
            {items.map((item, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="glass-panel p-4 rounded-2xl flex items-center gap-4 cursor-default border hover:border-primary/30 transition-colors"
                >
                    <span className="text-3xl filter drop-shadow-lg">{item.icon}</span>
                    <div>
                        <h4 className="font-bold text-white text-sm">{item.title}</h4>
                        <p className="text-xs text-gray-400">{item.desc}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}