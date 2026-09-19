"use client";

import Image from "next/image";
import { loginAction } from "@/actions/auth";
import { useActionState, useState } from "react";
import styles from "./login.module.css";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    null
  );

  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className={styles.loginPage}>

      <div className={styles.loginCard}>

        {/* =====================================================
            DECORACIÓN VISUAL DE LA CARD
        ===================================================== */}

        <Image
          src="/images/borde_esquina_superior_izquierda1.png"
          alt=""
          width={612}
          height={408}
          aria-hidden="true"
          className={`${styles.cardCornerImage} ${styles.cardCornerTopLeft}`}
        />

        <Image
          src="/images/borde_esquina_superior_derecha1.png"
          alt=""
          width={612}
          height={408}
          aria-hidden="true"
          className={`${styles.cardCornerImage} ${styles.cardCornerTopRight}`}
        />

        <Image
          src="/images/borde_esquina_inferior_izquierda1.png"
          alt=""
          width={612}
          height={408}
          aria-hidden="true"
          className={`${styles.cardCornerImage} ${styles.cardCornerBottomLeft}`}
        />

        <Image
          src="/images/borde_esquina_inferior_derecha1.png"
          alt=""
          width={612}
          height={408}
          aria-hidden="true"
          className={`${styles.cardCornerImage} ${styles.cardCornerBottomRight}`}
        />


        {/* =====================================================
            PANEL IZQUIERDO
        ===================================================== */}

        <section className={styles.brandPanel}>

          <Image
            src="/images/borde_esquina_inferior_derecho_dentro_de_card_cerca_a_borde_esquina_inferior_izquierda1.png"
            alt=""
            width={655}
            height={381}
            aria-hidden="true"
            className={styles.brandInternalCorner}
          />

          <div className={styles.brandContent}>

            {/* Imagen Bono Diario */}

            <div className={styles.brandImageWrapper}>

              <Image
                src="/images/bono-diario-login.png"
                alt="Bono Diario"
                width={1000}
                height={1000}
                priority
                className={styles.brandImage}
                sizes="(max-width: 850px) 90vw, 620px"
              />

            </div>


            {/* Características */}

            <div className={styles.features}>

              {/* Seguro */}

              <div className={styles.feature}>

                <div className={styles.featureIcon}>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>

                </div>

                <div>
                  <strong>Seguro</strong>
                  <span> y confiable</span>
                </div>

              </div>


              {/* Rápido */}

              <div className={styles.feature}>

                <div
                  className={`${styles.featureIcon} ${styles.featureIconAccent}`}
                >

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
                  </svg>

                </div>

                <div>
                  <strong>Rápido</strong>
                  <span> y fácil</span>
                </div>

              </div>


              {/* Organizado */}

              <div className={styles.feature}>

                <div
                  className={`${styles.featureIcon} ${styles.featureIconNavy}`}
                >

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m12 3 2.9 5.9 6.1.9-4.5 4.4 1.1 6.1-5.6-2.9-5.6 2.9 1.1-6.1L3 9.8l6.1-.9L12 3Z" />
                  </svg>

                </div>

                <div>
                  <strong>Organizado</strong>
                  <span> y eficiente</span>
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            PANEL DERECHO
        ===================================================== */}

        <section className={styles.formPanel}>

          <div className={styles.formContainer}>

            {/* Icono */}
              <div className={styles.userIconWrapper}>

                  <Image
                    src="/images/icono_inicio1.png"
                    alt="Inicio de sesión"
                    width={120}
                    height={120}
                    priority
                    className={styles.userLoginImage}
                  />

                </div>


            {/* Encabezado */}

            <div className={styles.header}>

              <h1>
                Iniciar sesión
              </h1>

              <p>
                Ingresa tus credenciales para acceder
                <br />
                al sistema de rifas.
              </p>

            </div>


            {/* Error */}

            {state?.error && (

              <div className={styles.error}>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>

                <span>
                  {state.error}
                </span>

              </div>

            )}


            {/* =================================================
                FORMULARIO
            ================================================= */}

            <form
              action={formAction}
              className={styles.form}
            >

              {/* Usuario */}

              <div className={styles.field}>

                <label htmlFor="email">
                  Usuario o correo
                </label>

                <div className={styles.inputWrapper}>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={styles.inputIcon}
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="username"
                    placeholder="mauro@admin.com"
                  />

                </div>

              </div>


              {/* Contraseña */}

              <div className={styles.field}>

                <label htmlFor="password">
                  Contraseña
                </label>

                <div className={styles.inputWrapper}>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={styles.inputIcon}
                  >
                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="11"
                      rx="2"
                    />

                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>


                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                  />


                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label={
                      showPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                  >

                    {showPassword ? (

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>

                    ) : (

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>

                    )}

                  </button>

                </div>

              </div>


              {/* Opciones */}

              <div className={styles.options}>

                <label className={styles.remember}>

                  <input
                    type="checkbox"
                    name="remember"
                  />

                  <span>
                    Recordarme
                  </span>

                </label>


                <button
                  type="button"
                  className={styles.recoveryLink}
                >
                  ¿Olvidaste tu contraseña?
                </button>

              </div>


              {/* Ingresar */}

              <button
                type="submit"
                disabled={isPending}
                className={styles.submit}
              >

                <span>
                  {isPending
                    ? "Validando credenciales..."
                    : "Ingresar"}
                </span>

                {!isPending && (

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line
                      x1="5"
                      y1="12"
                      x2="19"
                      y2="12"
                    />

                    <polyline points="12 5 19 12 12 19" />
                  </svg>

                )}

              </button>

            </form>


            {/* Separador */}

            <div className={styles.divider}>

              <span />

              <strong>
                ✿
              </strong>

              <span />

            </div>


            {/* Recuperación */}

            <div className={styles.recoveryBox}>

              <div className={styles.recoveryIcon}>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>

              </div>

              <div>

                <h2>
                  Recuperación de contraseña
                </h2>

                <p>
                  Si necesitas restablecer tu contraseña,
                  utiliza el código de recuperación
                  proporcionado por el administrador.
                </p>

              </div>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}