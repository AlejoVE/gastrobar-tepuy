import React from 'react'
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { Leaf, Award, Heart } from "lucide-react"

const About = () => {

    const { t } = useTranslation()


    const features = [
        { icon: Leaf, key: "feature1" },
        { icon: Award, key: "feature2" },
        { icon: Heart, key: "feature3" },
    ]
    return (
        <section className="bg-warm-cream py-20 lg:py-32">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <h2 className="font-sans text-4xl md:text-5xl lg:text-6xl font-light text-forest-green mb-8">
                        {t("about.title")}
                    </h2>
                    <div className="w-32 h-1 bg-natural-wood mx-auto mb-10"></div>
                    <p className="text-body-large leading-relaxed max-w-4xl mx-auto text-charcoal">{t("about.description")}</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.key}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="text-center bg-white rounded-2xl p-10 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
                        >
                            <div className="bg-sage-green/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8">
                                <feature.icon className="text-sage-green" size={36} />
                            </div>
                            <h3 className="font-sans text-2xl font-semibold mb-6 text-forest-green">
                                {t(`about.${feature.key}.title`)}
                            </h3>
                            <p className="text-body text-charcoal leading-relaxed">{t(`about.${feature.key}.description`)}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
export default About