import { motion, useReducedMotion } from 'motion/react';
import NewsletterForm from '../components/NewsletterForm.jsx';
import '../segment.css';

/* 
  Reusing a simple FAQ component style. 
  Or creating a local one. A simple accordion or list is fine.
*/
function FAQItem({ question, answer, prefersReducedMotion }) {
    // Simple details/summary for SEO and accessibility
    return (
        <motion.div
            className="faq-item"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
        >
            <h3>{question}</h3>
            <p>{answer}</p>
        </motion.div>
    );
}

export default function SegmentLanding({ data }) {
    const prefersReducedMotion = useReducedMotion();

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <main className="segment-landing">
            {/* Hero Section */}
            <section className="segment-hero">
                <div className="container">
                    <motion.div
                        className="hero-content"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                    >
                        <motion.h1
                            className="hero-title"
                            variants={itemVariants}
                            dangerouslySetInnerHTML={{ __html: data.hero.title }}
                        />
                        <motion.p
                            className="hero-subtitle"
                            variants={itemVariants}
                        >
                            {data.hero.subtitle}
                        </motion.p>
                        <motion.div variants={itemVariants}>
                            <NewsletterForm
                                buttonLabel={data.cta}
                                footer="Start tracking the signals that matter."
                                source={`segment-${data.title.toLowerCase().replace(/\s+/g, '-')}`}
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Value Props Section */}
            <section className="value-section">
                <div className="container">
                    <motion.div
                        className="value-grid"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={containerVariants}
                    >
                        {data.values.map((value, index) => (
                            <motion.div className="value-card" key={index} variants={itemVariants}>
                                <span className="value-number">0{index + 1}</span>
                                <h3>{value.title}</h3>
                                <p>{value.body}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section">
                <div className="container">
                    <motion.h2
                        className="section-title"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        Frequently Asked Questions
                    </motion.h2>
                    <div className="faq-grid">
                        {data.faqs.map((faq, index) => (
                            <FAQItem
                                key={index}
                                question={faq.question}
                                answer={faq.answer}
                                prefersReducedMotion={prefersReducedMotion}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="leisure-section">
                <div className="container">
                    <motion.div
                        className="leisure-content"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title">Join the Index today.</h2>
                        <p className="leisure-description">
                            Don't miss the next conviction shift.
                        </p>
                        <NewsletterForm
                            buttonLabel={data.cta}
                            source={`segment-footer-${data.title.toLowerCase().replace(/\s+/g, '-')}`}
                        />
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
