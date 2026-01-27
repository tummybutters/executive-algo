
import { motion, useReducedMotion } from 'motion/react';
import { briefPage } from '../data/pages.js';
import NewsletterForm from '../components/NewsletterForm.jsx';

export default function BriefPage() {
    const prefersReducedMotion = useReducedMotion();

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <main className="brief-page">
            <section className="brief-hero">
                <div className="container">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {briefPage.title}
                    </motion.h1>
                    <motion.p
                        className="brief-subtitle"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        {briefPage.subtitle}
                    </motion.p>
                </div>
            </section>

            <section className="brief-content">
                <div className="container">
                    <motion.div
                        className="brief-grid"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                    >
                        {briefPage.sections.map((section, idx) => (
                            <motion.div className="brief-card" key={idx} variants={itemVariants}>
                                <h3>{section.heading}</h3>
                                <p>{section.body}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Sample visual could go here, for now just text/cards */}

            <section className="brief-cta">
                <div className="container">
                    <div className="cta-wrapper">
                        <h3>Get the brief.</h3>
                        <NewsletterForm
                            buttonLabel="Subscribe"
                            source="page-brief"
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}
