# Graph Report - Cartefidelité  (2026-10-01)

## Corpus Check
- 661 files · ~4,774,899 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 19 file(s) not represented in the graph (top: (none) 6, .example 4, .css 3)

## Summary
- 3645 nodes · 11183 edges · 167 communities (146 shown, 21 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 73 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0c2a73c2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- caisse-scan.ts
- cashier-checkout.tsx
- rbac.ts
- merchant-card-template-service.ts
- env.ts
- components/ui.tsx
- loyalty-program.ts
- ref_next_navigation
- employee-session.ts
- loyalty-widget-view.tsx
- loyalty-widget.ts
- readJson
- VisualPicker
- card-editor-properties.tsx
- requireMutatingRequest
- loyalty-service.ts
- loyalty-context.ts
- generate-pwa-icons.mjs
- merchant-ui.tsx
- playwright
- clients/ui.tsx
- profile-page.tsx
- insight-period.ts
- zod
- google-auth.ts
- ref_next_server
- session.ts
- vitest
- ad-detail.tsx
- advantages-ui.tsx
- react
- create-super-admin.ts
- requireMerchantAdmin
- card-editor.tsx
- package.json
- google-wallet-media-crop.tsx
- statistiques-panel.tsx
- ad-visual-journeys.test.ts
- demo-session.ts
- What You Must Do When Invoked
- scan/ui.tsx
- media-storage.ts
- loyalty-commit.test.ts
- caisse-client-number.test.ts
- ref_fs_promises
- demo-routing.test.ts
- src/app/page.tsx
- compilerOptions
- wallet-home.tsx
- @prisma/client
- customer-loyalty-overview.ts
- qa-login.ts
- ref_node_fs_promises
- dependencies
- isGoogleWalletConfigured
- email.ts
- devDependencies
- insight-stats.ts
- tarifs/page.tsx
- demo-visual.ts
- new-card-toast.tsx
- loyalty-service.test.ts
- scripts
- types.ts
- platform-stats.ts
- google-wallet/route.ts
- fife-life/merchant-detail.tsx
- ref_path
- stripe-webhook-marketing.test.ts
- stripe-webhook-route.test.ts
- merchant-roulette.tsx
- staff-permissions.ts
- merchant-card-renderer.tsx
- AdvantagesEditor
- app/app/connexion/page.tsx
- ref_node_path
- unsubscribe-token.ts
- landing-header.tsx
- qr-input.ts
- stripe.ts
- super-admin-session.ts
- cartes.js
- Fideto
- docker-entrypoint.sh
- qr.ts
- EmployeeDetailPanel
- verify-viewports.mjs
- Notes pour le prochain agent - Carousel de cartes
- Cartes de fidélité — pack pour Cursor
- demo.js
- getEmployeeSession
- progress-ring.tsx
- semi-gauge.tsx
- campagnes/ui.tsx
- deploy.sh
- eslint.config.mjs
- next-env.d.ts
- postcss.config.mjs
- sw.js
- graphify reference: extra exports and benchmark
- customer-reward-progress.ts
- api-merchant-statistics-route.test.ts
- lib/campaign-worker.ts
- loyalty-commit.ts
- programme/ui.tsx
- graphify reference: query, path, explain
- campaign-worker.test.ts
- jsonError
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- notifications-center.tsx
- CLAUDE.md
- .claude/CLAUDE.md
- extraction-spec.md
- campaign-crud-routes.test.ts
- insight-definitions.ts
- layout-client.tsx
- ad-confirm-route.test.ts
- CardDeck
- campaign-confirm-route.test.ts
- sponsored-placements.test.ts
- wallet-unlock.ts
- bucketKey
- campaign-quota.test.ts
- webhook/route.ts
- [id]/merchant-detail.tsx
- customer-notifications-route.test.ts
- push.ts
- employees/[id]/route.ts
- super-admin-campaign-moderation.test.ts
- qa-login/page.tsx
- merchant-ad-edit.test.ts
- landing-page.test.ts
- campaign-test-mode-isolation.test.ts
- google-wallet-doctor.ts
- push-client.ts
- customer-push-route.test.ts
- statistiques-scroll.test.ts
- trim-card-images.mjs
- avatar-storage.ts
- scripts/campaign-worker.ts
- loyalty-cards-capture.mjs
- CampagnesPanel
- capture-super-admin.mjs
- employee-app-capture.mjs
- caisse-scan.test.ts
- employee-invitation-service.ts
- SettingsPanel
- marketing-topup-route.test.ts
- customer-preferences-route.test.ts
- google-wallet.ts
- app/ui.tsx
- solde/ui.tsx
- landing-merchant-preview.tsx
- GoogleWalletApiError
- merchant-app-access.ts
- sponsored-hours-pricing.ts
- super-admin-ad-moderation.test.ts
- demo/scan/page.tsx
- sponsored-selection.ts
- invitation/page.tsx
- landing-footer.tsx
- card-template-schema.ts

## God Nodes (most connected - your core abstractions)
1. `jsonError()` - 229 edges
2. `jsonOk()` - 203 edges
3. `requireMutatingRequest()` - 140 edges
4. `prisma` - 131 edges
5. `vitest` - 110 edges
6. `readJson()` - 104 edges
7. `react` - 102 edges
8. `clientIp()` - 100 edges
9. `userAgent()` - 96 edges
10. `@prisma/client` - 95 edges

## Surprising Connections (you probably didn't know these)
- `submit()` --indirect_call--> `schedule()`  [INFERRED]
  src/app/app/campagnes/ui.tsx → tests/ad-visual-journeys.test.ts
- `loop()` --calls--> `runWorkerTick()`  [EXTRACTED]
  scripts/campaign-worker.ts → src/lib/campaign-worker.ts
- `main()` --calls--> `getActiveMerchantLoyaltyContext()`  [EXTRACTED]
  scripts/diagnose-loyalty-program.ts → src/lib/loyalty-context.ts
- `main()` --calls--> `googleWalletLogoUrl()`  [EXTRACTED]
  scripts/google-wallet-doctor.ts → src/lib/google-wallet.ts
- `click()` --calls--> `GET()`  [EXTRACTED]
  tests/sponsored-placements.test.ts → src/app/api/customer/sponsored/route.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (167 total, 21 thin omitted)

### Community 0 - "caisse-scan.ts"
Cohesion: 0.14
Nodes (20): logScanBody(), POST(), scanVia(), buildScanResult(), CaisseScanError, maskClientNumberForLog(), findUserByCustomerNumber(), processCaisseScan() (+12 more)

### Community 1 - "cashier-checkout.tsx"
Cohesion: 0.19
Nodes (16): AmountField(), press(), KEYS, CashierCheckout(), askRedeem(), commitEarn(), confirmRedeem(), Phase (+8 more)

### Community 2 - "rbac.ts"
Cohesion: 0.13
Nodes (16): CustomerDetailPage(), assertCanAddEmployee(), canAddEmployee(), canAdjustPoints(), canViewAllCustomers(), MAX_ACTIVE_EMPLOYEES, staffHasPermission(), StaffMembership (+8 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.06
Nodes (59): ALL_SLOTS, cardCounts(), CardsIndexPage(), hasPublishedActiveSlot(), MerchantCardRow, modeLabel(), pickCurrentTemplate(), statusLabel() (+51 more)

### Community 4 - "env.ts"
Cohesion: 0.06
Nodes (21): nextConfig, next, ref_next_font_google, metadata, viewport, src_app_globals, dynamic, manrope (+13 more)

### Community 5 - "components/ui.tsx"
Cohesion: 0.06
Nodes (39): ref_next_link, Merchant, MerchantPublic(), CustomerLoginPage(), CustomerLoginForm(), googleMessage(), SPACES, EmployeeLoginScreen() (+31 more)

### Community 6 - "loyalty-program.ts"
Cohesion: 0.10
Nodes (34): block(), buildNextBenefit(), centsToEarnAtLeast(), EarnEvaluation, evaluateEarn(), formatDurationMinutes(), minutesBetween(), progressLabelFor() (+26 more)

### Community 7 - "ref_next_navigation"
Cohesion: 0.27
Nodes (17): ref_next_navigation, CampagneFichePage(), CampagnesPage(), SoldeMarketingPage(), ClientsPage(), FidelisationPage(), OutilsPage(), MerchantHomePage() (+9 more)

### Community 8 - "employee-session.ts"
Cohesion: 0.20
Nodes (15): cookieOptions(), createEmployeeSession(), destroyEmployeeSession(), employeeCookieName(), employeeFromToken(), employeeFromTokenWithReason(), EmployeeSession, employeeTokenFromRequest() (+7 more)

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.08
Nodes (35): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetProgress, LoyaltyWidgetProgressInput, LoyaltyWidgetView(), pct() (+27 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.08
Nodes (50): LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), applyEditorAutoFix(), dedupeIssues(), EditorValidationIssue, EditorValidationSummary, migrateLegacyOnLoad(), missingWidgetLabel() (+42 more)

### Community 11 - "readJson"
Cohesion: 0.05
Nodes (71): schema, POST(), POST(), POST(), GET(), PATCH(), GET(), PATCH() (+63 more)

### Community 12 - "VisualPicker"
Cohesion: 0.19
Nodes (13): deleteCampaignMediaUrl(), loadImageElement(), readFileAsDataUrl(), SelfVisualCropper(), uploadCampaignMedia(), VisualPicker(), dropSelfFiles(), onCropConfirm() (+5 more)

### Community 13 - "card-editor-properties.tsx"
Cohesion: 0.07
Nodes (63): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, GuideLine, handlesForElement() (+55 more)

### Community 14 - "requireMutatingRequest"
Cohesion: 0.11
Nodes (52): POST(), POST(), POST(), POST(), schema, POST(), POST(), POST() (+44 more)

### Community 15 - "loyalty-service.ts"
Cohesion: 0.15
Nodes (22): GET(), sortOrder(), assertEarnProgramRules(), applyAdjustment(), applyEarnVisit(), applyRedeemReward(), balanceFieldForUnit(), incrementBalanceData() (+14 more)

### Community 16 - "loyalty-context.ts"
Cohesion: 0.10
Nodes (38): formatAddress(), MerchantProfile(), join(), MerchantProfileData, safeExternalUrl(), TargetBlock(), buildProgramSnapshot(), buildProgramSnapshotFromContext() (+30 more)

### Community 17 - "generate-pwa-icons.mjs"
Cohesion: 0.16
Nodes (12): ref_node_buffer, ref_node_url, ref_node_zlib, outDir, outFile, root, chunk(), color (+4 more)

### Community 18 - "merchant-ui.tsx"
Cohesion: 0.11
Nodes (22): EmployeeDetailPage(), EmployeesPage(), DEMO, Employee, EmployeesPanel(), formatActivity(), statusBadgeLabel(), statusTone() (+14 more)

### Community 19 - "playwright"
Cohesion: 0.15
Nodes (7): playwright, main(), outDir, shot(), OUT, OUT, OUT

### Community 20 - "clients/ui.tsx"
Cohesion: 0.16
Nodes (14): Customer, CustomerDetail, CustomerDetailPanel(), CustomerInsight, CustomersPanel(), CustomerStats, CustomerTx, DEMO (+6 more)

### Community 21 - "profile-page.tsx"
Cohesion: 0.07
Nodes (39): FILTER_MAP, GET(), AvatarFileInput(), AvatarPreviewEditor(), cropCircleToDataUrl(), loadImage(), useAvatarEditor(), SheetAction() (+31 more)

### Community 22 - "insight-period.ts"
Cohesion: 0.21
Nodes (21): addParisDays(), addParisMonths(), enumerateDayKeys(), enumerateMonthKeys(), enumerateWeekKeys(), InsightBucket, InsightPeriodKey, PARIS_TZ (+13 more)

### Community 23 - "zod"
Cohesion: 0.13
Nodes (19): zod, POST(), dynamic, logCustomerQr(), POST(), runtime, schema, POST() (+11 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.14
Nodes (25): GET(), GET(), isGoogleAuthConfigured(), consumeGoogleCallback(), createGoogleAuthUrl(), decodeStateCookie(), encodeStateCookie(), GOOGLE_SCOPES (+17 more)

### Community 25 - "ref_next_server"
Cohesion: 0.10
Nodes (25): ref_next_server, hostMatches(), hostnameOf(), isAdminHost(), isAppHost(), isCustomerHost(), isEmployeeHost(), isLocalHost() (+17 more)

### Community 26 - "session.ts"
Cohesion: 0.08
Nodes (46): main(), dynamic, GET(), GET(), GET(), dynamic, MerchantProfilePage(), CarteIdentitePage() (+38 more)

### Community 27 - "vitest"
Cohesion: 0.22
Nodes (8): vitest, createDirectEmployee(), CreateEmployeeInput, EmployeeCreateError, presetPermissions(), createEmployeeSchema, customerMembershipFindMany, customerPreferencesFindMany

### Community 28 - "ad-detail.tsx"
Cohesion: 0.09
Nodes (39): AdStatus, api(), Detail, euros(), HistoryRow, MerchantCampaignFiche(), addSources(), onFile() (+31 more)

### Community 29 - "advantages-ui.tsx"
Cohesion: 0.16
Nodes (15): DEMO_CONFIG, HistoricalEntitlement, emptyReward(), FieldErrors, previewLine(), REWARD_TYPES, RewardFormDialog(), handleSubmit() (+7 more)

### Community 30 - "react"
Cohesion: 0.07
Nodes (25): react, recharts, AD_STATUS_FILTER_OPTIONS, AD_STATUS_LABELS, AdRequest, AdStatus, CampaignModerationHome(), formatCents() (+17 more)

### Community 31 - "create-super-admin.ts"
Cohesion: 0.50
Nodes (4): bcryptjs, main(), prisma, required()

### Community 32 - "requireMerchantAdmin"
Cohesion: 0.13
Nodes (40): computeAdPricing(), GET(), POST(), POST(), GET(), GET(), POST(), serializeCampaign() (+32 more)

### Community 33 - "card-editor.tsx"
Cohesion: 0.11
Nodes (30): buildElementCatalog(), CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction() (+22 more)

### Community 34 - "package.json"
Cohesion: 0.07
Nodes (26): description, engines, node, name, prisma, seed, private, version (+18 more)

### Community 35 - "google-wallet-media-crop.tsx"
Cohesion: 0.24
Nodes (12): GoogleWalletMediaCrop(), confirm(), onPointerMove(), patchState(), centeredCropState(), clampCropState(), computeCoverCrop(), CropState (+4 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.09
Nodes (32): ApiResponse, COMPARISON_METRICS, FideliteTab(), FinancesTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder (+24 more)

### Community 37 - "ad-visual-journeys.test.ts"
Cohesion: 0.04
Nodes (83): GET(), EDITABLE_STATUSES, GET(), PATCH(), GET(), POST(), POST(), schema (+75 more)

### Community 38 - "demo-session.ts"
Cohesion: 0.20
Nodes (14): GET(), GET(), GET(), GET(), GET(), demoCookieNamesForRole(), applyDemoRoleCookies(), clearCookieOnResponse() (+6 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "scan/ui.tsx"
Cohesion: 0.13
Nodes (31): ADMIN_PERMISSIONS, CaisseScreen(), ScanResult, EmployeeProfile, EmployeeScanScreen(), Phase, ScanResult, statusLabel() (+23 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.11
Nodes (29): appearanceKeyForGoogleWalletMedia(), assertExactDimensions(), assertPublishedGoogleWalletMediaReadable(), deleteCampaignMedia(), deleteCardBackground(), getUploadsRoot(), GoogleWalletMediaKind, GoogleWalletPublicMediaKind (+21 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "caisse-client-number.test.ts"
Cohesion: 0.24
Nodes (11): deriveClientNumber(), formatClientNumberDisplay(), normalizeClientNumber(), normalizeCustomerNumber(), resolveClientNumber(), readManualClientNumber(), scanSchema, fifeLifeQrTokenCreate (+3 more)

### Community 44 - "ref_fs_promises"
Cohesion: 0.13
Nodes (13): ref_fs_promises, ref_os, OUT, tiers, GET(), MIME, GET(), MIME (+5 more)

### Community 45 - "demo-routing.test.ts"
Cohesion: 0.12
Nodes (20): ref_next_headers, CaisseAliasPage(), EmployeeHomePage(), EmployeeScanPage(), CLIENT_DEMO_COOKIE, EMPLOYEE_DEMO_COOKIE, isClientDemoMode(), isDemoCookie() (+12 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.09
Nodes (29): BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, MERCHANT_BENEFITS, metadata, PROOF_ITEMS, ArrowRightIcon(), base (+21 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "wallet-home.tsx"
Cohesion: 0.09
Nodes (38): AddToGoogleWalletButton(), DiscoverIconLink(), NotificationBellLink(), useWalletEvents(), connect(), disconnect(), onVisibility(), isDocumentVisible() (+30 more)

### Community 49 - "@prisma/client"
Cohesion: 0.12
Nodes (29): @prisma/client, GET(), loadProgram(), POST(), activeEligibleRewards(), assertRewardLimit(), countConfiguredRewards(), createAcquiredRewardEntitlements() (+21 more)

### Community 50 - "customer-loyalty-overview.ts"
Cohesion: 0.15
Nodes (16): activityFromWalletEvent(), ActivityItem, buildCardNextRewardEntry(), buildHistoricalRewardOverview(), CardRewardProgress, formatActivityDate(), formatActivityFromTransaction(), getCustomerLoyaltyActivity() (+8 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.09
Nodes (37): ref_crypto, assertNoUnknownArgs(), main(), parseTtlMinutes(), GET(), POST(), QaExchangeBody, qaJson() (+29 more)

### Community 52 - "ref_node_fs_promises"
Cohesion: 0.11
Nodes (8): ref_node_fs_promises, OUT, OUT, merchantSlugs, OUT, goto(), OUT, OUT

### Community 53 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+11 more)

### Community 54 - "isGoogleWalletConfigured"
Cohesion: 0.18
Nodes (24): isGoogleWalletConfigured(), assertConfigured(), buildGoogleWalletIds(), classProfileForMode(), createGlobalGoogleWalletSaveUrl(), createMerchantGoogleWalletSaveUrl(), customerQrValue(), ensureGlobalClassRecord() (+16 more)

### Community 55 - "email.ts"
Cohesion: 0.25
Nodes (14): buildCampaignEmailContent(), buildInvitationContent(), CampaignEmailInput, emailConfigHint(), EmailSendResult, EmployeeInvitationEmailInput, escapeHtml(), formatExpiry() (+6 more)

### Community 56 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, eslint-config-next, happy-dom, playwright, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+8 more)

### Community 57 - "insight-stats.ts"
Cohesion: 0.10
Nodes (30): InsightRange, buildFinancial(), buildOverview(), buildRetention(), buildRewards(), buildSegments(), buildTeam(), getFreeMerchantStats() (+22 more)

### Community 58 - "tarifs/page.tsx"
Cohesion: 0.18
Nodes (9): HomePage(), FIDETO_MONTHLY, metadata, PACK_SETUP, TarifsPage(), PricingFaq(), QUESTIONS, resolveLandingAuthTargets() (+1 more)

### Community 59 - "demo-visual.ts"
Cohesion: 0.17
Nodes (11): PREVIEW_PREFERENCES, PREVIEW_PROFILE, CustomerLoyaltyOverview, DEMO_LOYALTY_OVERVIEW, DEMO_EMAIL, DEMO_FIRST_NAME, DEMO_FULL_NAME, DEMO_LAST_NAME (+3 more)

### Community 60 - "new-card-toast.tsx"
Cohesion: 0.13
Nodes (19): ref_motion_react, react-dom, ref_react_dom_client, CardsSheet(), ExpandableQrCode(), handleActivate(), openQr(), ExpandableQrCodeProps (+11 more)

### Community 61 - "loyalty-service.test.ts"
Cohesion: 0.14
Nodes (13): activeProgram, baseMembership, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeLedgerCreate, loyaltyProgramFindUnique (+5 more)

### Community 62 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:migrate, db:migrate:dev, db:seed, db:studio, dev, icons (+6 more)

### Community 63 - "types.ts"
Cohesion: 0.06
Nodes (53): DeckItem, demoStartIndex(), CardEnlargedView(), CardEnlargedViewProps, isFifeLifeCard(), DEMO_TIER_POINTS, GlobalCard(), GlobalCardMode (+45 more)

### Community 64 - "platform-stats.ts"
Cohesion: 0.16
Nodes (21): GET(), BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr() (+13 more)

### Community 65 - "google-wallet/route.ts"
Cohesion: 0.17
Nodes (21): ensureWalletClassRecord(), parseWalletAction(), POST(), publishedMediaExists(), schema, validateAppearanceColor(), contrastWithWhite(), GOOGLE_WALLET_RECOMMENDED_COLORS (+13 more)

### Community 66 - "fife-life/merchant-detail.tsx"
Cohesion: 0.10
Nodes (18): ref_react_dom_server, CustomerProgramView, DETAIL_TABS, DetailTabId, EMPTY_RECENT_ACTIVITY, MerchantCardDetail(), fallbackCopyLink(), shareCard() (+10 more)

### Community 67 - "ref_path"
Cohesion: 0.12
Nodes (8): ref_fs, ref_path, ref_vitest_config, outDir, main(), outDir, shot(), loadMiddleware()

### Community 68 - "stripe-webhook-marketing.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent, creditTopup (+5 more)

### Community 69 - "stripe-webhook-route.test.ts"
Cohesion: 0.11
Nodes (15): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindFirst, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent (+7 more)

### Community 70 - "merchant-roulette.tsx"
Cohesion: 0.38
Nodes (3): LinearGauge(), MerchantFace(), MerchantRoulette()

### Community 71 - "staff-permissions.ts"
Cohesion: 0.18
Nodes (9): ADMIN_PERMISSIONS, CASHIER_DEFAULT, CRITICAL_PERMISSION_KEYS, EMPLOYEE_FIXED_PERMISSIONS, MANAGER_DEFAULT, PERMISSION_KEYS, PERMISSION_LABELS, PermissionKey (+1 more)

### Community 72 - "merchant-card-renderer.tsx"
Cohesion: 0.12
Nodes (33): COMPACT_HIDDEN, displayClientName(), elementShellStyle(), ElementView(), MerchantCardDisplayMode, MerchantCardRendererProps, resolveDisplayQrSrc(), shouldHideElement() (+25 more)

### Community 73 - "AdvantagesEditor"
Cohesion: 0.26
Nodes (16): AdvantagesEditor(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward(), openEditReward() (+8 more)

### Community 74 - "app/app/connexion/page.tsx"
Cohesion: 0.36
Nodes (7): AppLoginPage(), isGoogleSignInEnabled(), formatEurosFromCents(), isMerchantPlanId(), MERCHANT_PLANS, MerchantPlan, MerchantPlanId

### Community 75 - "ref_node_path"
Cohesion: 0.09
Nodes (17): ref_node_fs, ref_node_path, outDir, outDir, outDir, CARD_SCHEMA_VERSION, src_lib_card_template_schema_card_schema_version, cardTemplateConfigSchema (+9 more)

### Community 76 - "unsubscribe-token.ts"
Cohesion: 0.22
Nodes (10): jose, secretKey(), signUnsubscribeToken(), UnsubscribePayload, UnsubscribeScope, UnsubscribeTokenError, unsubscribeUrl(), verifyUnsubscribeToken() (+2 more)

### Community 77 - "landing-header.tsx"
Cohesion: 0.28
Nodes (7): next-themes, MoonIcon(), SunIcon(), isInternalRoute(), LandingHeader(), NAV_LINKS, ThemeToggle()

### Community 78 - "qr-input.ts"
Cohesion: 0.43
Nodes (5): ALLOWED_QR_HOSTS, extractFifeLifeQrToken(), extractJwtFromText(), QrInputError, readManualToken()

### Community 79 - "stripe.ts"
Cohesion: 0.12
Nodes (25): stripe, CampaignCheckoutInput, checkoutExpiry(), clientForMode(), clients, constructStripeWebhookEvent(), createCampaignCheckoutSession(), createMarketingTopupCheckoutSession() (+17 more)

### Community 80 - "super-admin-session.ts"
Cohesion: 0.05
Nodes (41): SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight(), AuditPage(), SuperAdminAuditPage(), SuperAdminAdDetailPage(), SuperAdminCampagnesPage() (+33 more)

### Community 81 - "cartes.js"
Cohesion: 0.53
Nodes (5): getViewModel(), mount(), update(), nonNegativeNumber(), safeImageUrl()

### Community 82 - "Fideto"
Cohesion: 0.13
Nodes (14): Checklist de déploiement, Configuration Google Wallet, Création des sous-domaines DNS, Déploiement d’une mise à jour, Déploiement initial, Déploiement VPS sans Docker local, Fideto, Installation locale (sans Docker) (+6 more)

### Community 83 - "docker-entrypoint.sh"
Cohesion: 0.70
Nodes (4): fail(), is_placeholder_secret(), docker-entrypoint.sh script, validate_production_secrets()

### Community 84 - "qr.ts"
Cohesion: 0.17
Nodes (17): main(), prisma, requiredEnv(), upsertEmployee(), qrcode, ensureCustomerMembershipForSlug(), ensureCustomerQrToken(), generateCustomerQrDataUrl() (+9 more)

### Community 85 - "EmployeeDetailPanel"
Cohesion: 0.29
Nodes (6): EmployeeDetailPanel(), patchEmployee(), reactivate(), resendInvite(), saveProfile(), suspend()

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "getEmployeeSession"
Cohesion: 0.47
Nodes (4): EmployeeLoginPage(), ProEntryPage(), SPACES, getEmployeeSession()

### Community 93 - "campagnes/ui.tsx"
Cohesion: 0.05
Nodes (30): AD_STATUS_LABELS, addDaysToDateInput(), AdRequest, AdStatus, Audience, AUDIENCE_LABELS, CampaignSummary, Channel (+22 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "customer-reward-progress.ts"
Cohesion: 0.21
Nodes (16): buildTargetView(), getCustomerMerchantRewardProgress(), resolveVisualState(), MerchantRewardProgressTarget, REWARD_ALMOST_THRESHOLD_PERCENT, RewardProgressVisualState, progressLineForTarget(), evaluateCustomerRewards() (+8 more)

### Community 102 - "api-merchant-statistics-route.test.ts"
Cohesion: 0.20
Nodes (8): findUniqueSubscription, FREE_STATS, getFreeMerchantStats, getInsightPremium, getLockedInsightPlaceholder, REAL_PLACEHOLDER, REAL_PREMIUM, requireMerchantStatsAccess

### Community 103 - "lib/campaign-worker.ts"
Cohesion: 0.26
Nodes (12): backoffMinutesForAttempt(), claimNextScheduledCampaign(), deliveryChannelsFor(), finalizeCampaignIfComplete(), materializeDeliveries(), processPendingDeliveries(), runWorkerTick(), sendOneDelivery() (+4 more)

### Community 104 - "loyalty-commit.ts"
Cohesion: 0.10
Nodes (36): appliedTierLabel(), assembleView(), buildView(), commitLoyaltyTransaction(), customerName(), isMerchantActive(), isProgramActive(), loadEarnHistory() (+28 more)

### Community 105 - "programme/ui.tsx"
Cohesion: 0.16
Nodes (14): DEMO_CONFIG, MODES, modeTitle(), PROGRAM_STEPS, ProgramConfigurator(), goToStep(), isCurrentReward(), primaryFooterAction() (+6 more)

### Community 106 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 107 - "campaign-worker.test.ts"
Cohesion: 0.12
Nodes (16): rows(), baseCampaign, campaignDeliveryCount, campaignDeliveryCreateMany, campaignDeliveryFindMany, campaignDeliveryUpdate, campaignUpdate, customerMembershipFindMany (+8 more)

### Community 108 - "jsonError"
Cohesion: 0.06
Nodes (81): GET(), PATCH(), GET(), POST(), GET(), GET(), GET(), DELETE() (+73 more)

### Community 109 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 110 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 111 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 114 - "notifications-center.tsx"
Cohesion: 0.10
Nodes (18): DiscoverPage(), Merchant, DEMO_NOTIFICATIONS, kindLabel(), NotificationItem, NotificationKind, NotificationMerchant, NotificationsCenter() (+10 more)

### Community 118 - "campaign-crud-routes.test.ts"
Cohesion: 0.20
Nodes (8): campaignCreate, campaignFindFirst, campaignFindMany, campaignUpdate, refundCampaignDebit, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 120 - "layout-client.tsx"
Cohesion: 0.21
Nodes (8): DashboardLayout(), AppNav(), icons, isActive(), TOOLS_PREFIXES, BellItem, formatWhen(), NotificationBell()

### Community 121 - "ad-confirm-route.test.ts"
Cohesion: 0.13
Nodes (12): adRequestFindFirst, adRequestUpdate, campaignUpdate, createCampaignCheckoutSession, executeRaw, FakeStripeNotConfiguredError, getQuotaUsage, paymentUpsert (+4 more)

### Community 122 - "CardDeck"
Cohesion: 0.21
Nodes (10): activeCardFromDeck(), CardDeck(), handleCardExpand(), handleDragEnd(), handleKeyDown(), snapTo(), readDeckMetrics(), CARD_NO_EXPAND_SELECTOR (+2 more)

### Community 123 - "campaign-confirm-route.test.ts"
Cohesion: 0.12
Nodes (17): baseCampaign, campaignFindFirst, campaignUpdate, campaignUpdateMany, debitForCampaign, estimateMerchantMembersAudience, estimateNetworkLocalAudience, getMarketingBalanceCents (+9 more)

### Community 124 - "sponsored-placements.test.ts"
Cohesion: 0.13
Nodes (18): applyUpdate(), createFakeAdDb(), hydrate(), model(), match(), matchValue(), merchantInfo, nextId() (+10 more)

### Community 125 - "wallet-unlock.ts"
Cohesion: 0.19
Nodes (15): dynamic, GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), runtime, sseChunk(), cardFromUnlockEvent() (+7 more)

### Community 126 - "bucketKey"
Cohesion: 0.53
Nodes (6): bucketKey(), enumerateBucketKeys(), buildCohorts(), buildComparison(), buildFrequentation(), fillSeries()

### Community 127 - "campaign-quota.test.ts"
Cohesion: 0.47
Nodes (5): campaignQuotaUsageFindUnique, campaignQuotaUsageUpsert, executeRaw, fakeTx(), merchantSubscriptionFindUnique

### Community 128 - "webhook/route.ts"
Cohesion: 0.09
Nodes (33): POST(), DELETE(), GET(), loadOwnedCampaign(), PATCH(), handleChargeRefunded(), handleCheckoutSessionCompleted(), handleCheckoutSessionExpired() (+25 more)

### Community 129 - "[id]/merchant-detail.tsx"
Cohesion: 0.12
Nodes (18): MEDIA_TO_APPEARANCE_KEY, RECOMMENDED_WALLET_COLORS, WalletAppearance, WalletMediaKey, WalletMediaPreview, WalletPreviewView, formatActivity(), MerchantRow (+10 more)

### Community 130 - "customer-notifications-route.test.ts"
Cohesion: 0.33
Nodes (5): inAppNotificationCount, inAppNotificationFindMany, inAppNotificationUpdateMany, requireMutatingRequest, requireUser

### Community 131 - "push.ts"
Cohesion: 0.31
Nodes (7): web-push, isWebPushConfigured(), ensureConfigured(), PushPayload, PushSendResult, sendPushToSubscription(), WebPushNotConfiguredError

### Community 132 - "employees/[id]/route.ts"
Cohesion: 0.25
Nodes (14): GET(), GET(), mapEmployee(), PATCH(), employeeLoginUrl(), GET(), mapEmployee(), POST() (+6 more)

### Community 133 - "super-admin-campaign-moderation.test.ts"
Cohesion: 0.18
Nodes (9): campaignFindUnique, campaignPaymentUpdate, campaignUpdate, refundCampaignDebit, refundCampaignPayment, refundIncludedQuota, requireMutatingRequest, requireSuperAdmin (+1 more)

### Community 134 - "qa-login/page.tsx"
Cohesion: 0.38
Nodes (4): dynamic, QaLoginPage(), QaLoginClient(), readFragmentToken()

### Community 135 - "merchant-ad-edit.test.ts"
Cohesion: 0.22
Nodes (6): adRequestFindFirst, adRequestUpdate, campaignUpdate, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 136 - "landing-page.test.ts"
Cohesion: 0.18
Nodes (9): authTargets, connexionUi, faq, footer, header, heroVisual, page, proPage (+1 more)

### Community 137 - "campaign-test-mode-isolation.test.ts"
Cohesion: 0.13
Nodes (14): adEventCreate, adRequestFindMany, adRequestFindUnique, campaignDeliveryCreateMany, campaignUpdate, customerMembershipFindMany, customerPreferencesFindMany, inAppNotificationCreate (+6 more)

### Community 138 - "google-wallet-doctor.ts"
Cohesion: 0.52
Nodes (6): google-auth-library, accessToken(), fail(), main(), ok(), pngSize()

### Community 139 - "push-client.ts"
Cohesion: 0.39
Nodes (5): enablePushNotifications(), getPushSupportState(), isIosNotStandalone(), PushSupportState, urlBase64ToUint8Array()

### Community 140 - "customer-push-route.test.ts"
Cohesion: 0.33
Nodes (4): pushSubscriptionDeleteMany, pushSubscriptionUpsert, requireMutatingRequest, requireUser

### Community 141 - "statistiques-scroll.test.ts"
Cohesion: 0.33
Nodes (4): appNav, globalsCss, layoutClient, statistiquesPanel

### Community 142 - "trim-card-images.mjs"
Cohesion: 0.40
Nodes (3): ref_sharp, files, INPUT_DIR

### Community 143 - "avatar-storage.ts"
Cohesion: 0.50
Nodes (4): AVATAR_DIR, MIME_TO_EXT, parseAvatarDataUrl(), saveAvatar()

### Community 144 - "scripts/campaign-worker.ts"
Cohesion: 0.60
Nodes (5): log(), loop(), requestShutdown(), sleep(), runAdLifecycleTick()

### Community 145 - "loyalty-cards-capture.mjs"
Cohesion: 0.40
Nodes (3): goto(), OUT, tiers

### Community 146 - "CampagnesPanel"
Cohesion: 0.12
Nodes (10): audienceDisplay(), CampagnesPanel(), CampaignWizard(), estimateSponsorPricing(), formatCents(), formatDate(), MarketingBalanceSummary(), SponsorWizard() (+2 more)

### Community 149 - "caisse-scan.test.ts"
Cohesion: 0.13
Nodes (14): caisseGrantCreate, customerMembershipCreate, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeQrTokenFindUnique, fifeLifeQrTokenUpdate (+6 more)

### Community 150 - "employee-invitation-service.ts"
Cohesion: 0.16
Nodes (20): GET(), POST(), buildInvitationLink(), canEmployeeAccess(), createInvitationToken(), hashInvitationToken(), INVITATION_ERROR, invitationExpiryDate() (+12 more)

### Community 152 - "marketing-topup-route.test.ts"
Cohesion: 0.20
Nodes (8): createMarketingTopupCheckoutSession, FakeStripeNotConfiguredError, ledgerCreate, ledgerUpdate, requireMerchantAdmin, requireMutatingRequest, stripeMode, writeAudit

### Community 153 - "customer-preferences-route.test.ts"
Cohesion: 0.22
Nodes (7): basePrefs, consentEventCreateMany, customerPreferencesCreate, customerPreferencesFindUnique, customerPreferencesUpdate, requireMutatingRequest, requireUser

### Community 154 - "google-wallet.ts"
Cohesion: 0.22
Nodes (22): appLinkData(), availableRewardModules(), cardUrl(), classTemplateInfo(), globalClassPatchBody(), globalObjectBody(), GoogleWalletImage, googleWalletLogoUrl() (+14 more)

### Community 155 - "app/ui.tsx"
Cohesion: 0.18
Nodes (6): HomeStats, KPI_ICONS, MerchantHome(), QUICK_ACTIONS, StatsPreview, TrendMetric

### Community 156 - "solde/ui.tsx"
Cohesion: 0.23
Nodes (11): historyDateKey(), HistoryFilter, matchesFilter(), SoldeMarketingPanel(), topup(), BalanceData, DEMO_BALANCE, LedgerEntry (+3 more)

### Community 157 - "landing-merchant-preview.tsx"
Cohesion: 0.50
Nodes (3): BARS, LandingMerchantPreview(), STATS

### Community 158 - "GoogleWalletApiError"
Cohesion: 0.67
Nodes (3): accessToken(), GoogleWalletApiError, walletFetch()

### Community 159 - "merchant-app-access.ts"
Cohesion: 0.20
Nodes (12): CaissePage(), DashboardLayout(), heatmap, INSIGHT_DEMO_RESPONSE, StatistiquesPage(), hasMerchantStaffAccess(), isMerchantAppPublicPath(), MERCHANT_APP_PUBLIC_PATHS (+4 more)

### Community 160 - "sponsored-hours-pricing.ts"
Cohesion: 0.14
Nodes (15): GET(), GET(), isSafeAdUrl(), isWithinUtcIntervals(), MAX_SPONSORED_DAYS, MIN_HOURS_PER_DAY, MIN_SPONSORED_DAYS, SPONSORED_HOUR_RATE_CENTS (+7 more)

### Community 161 - "super-admin-ad-moderation.test.ts"
Cohesion: 0.22
Nodes (6): adRequestFindUnique, adRequestUpdate, campaignUpdate, requireMutatingRequest, requireSuperAdmin, writeAudit

### Community 166 - "sponsored-selection.ts"
Cohesion: 0.13
Nodes (22): GET(), AdCandidate, CustomerZone, GLOBAL_COOLDOWN_MS, IMPRESSION_DEDUPE_MS, inAudience(), isAdEligibleForCustomer(), isEligibleNow() (+14 more)

### Community 172 - "landing-footer.tsx"
Cohesion: 0.67
Nodes (3): COLUMNS, isInternalPath(), LandingFooter()

### Community 173 - "card-template-schema.ts"
Cohesion: 0.09
Nodes (20): CardTemplateBackground(), CardEditorBackgroundCrop(), buildCardBackgroundImageStyle(), CardBackgroundSettings, DEFAULT_BACKGROUND, CardDecorativeStyle, cardElementSchema, CardLogoStyle (+12 more)

## Knowledge Gaps
- **938 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+933 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1252 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@prisma/client` connect `@prisma/client` to `webhook/route.ts`, `cashier-checkout.tsx`, `rbac.ts`, `merchant-card-template-service.ts`, `components/ui.tsx`, `loyalty-program.ts`, `employee-session.ts`, `loyalty-widget.ts`, `readJson`, `card-editor-properties.tsx`, `requireMutatingRequest`, `loyalty-service.ts`, `loyalty-context.ts`, `profile-page.tsx`, `employee-invitation-service.ts`, `google-auth.ts`, `ref_next_server`, `session.ts`, `vitest`, `google-wallet.ts`, `advantages-ui.tsx`, `merchant-app-access.ts`, `create-super-admin.ts`, `card-editor.tsx`, `package.json`, `requireMerchantAdmin`, `ad-visual-journeys.test.ts`, `sponsored-selection.ts`, `card-template-schema.ts`, `wallet-home.tsx`, `customer-loyalty-overview.ts`, `qa-login.ts`, `insight-stats.ts`, `loyalty-service.test.ts`, `types.ts`, `platform-stats.ts`, `staff-permissions.ts`, `merchant-card-renderer.tsx`, `super-admin-session.ts`, `qr.ts`, `customer-reward-progress.ts`, `lib/campaign-worker.ts`, `loyalty-commit.ts`, `programme/ui.tsx`, `jsonError`, `wallet-unlock.ts`?**
  _High betweenness centrality (0.153) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `caisse-scan.ts`, `rbac.ts`, `merchant-card-template-service.ts`, `env.ts`, `components/ui.tsx`, `loyalty-program.ts`, `loyalty-widget-view.tsx`, `loyalty-widget.ts`, `card-editor-properties.tsx`, `loyalty-service.ts`, `loyalty-context.ts`, `insight-period.ts`, `google-auth.ts`, `ref_next_server`, `session.ts`, `react`, `requireMerchantAdmin`, `package.json`, `google-wallet-media-crop.tsx`, `statistiques-panel.tsx`, `ad-visual-journeys.test.ts`, `scan/ui.tsx`, `media-storage.ts`, `loyalty-commit.test.ts`, `caisse-client-number.test.ts`, `ref_fs_promises`, `demo-routing.test.ts`, `wallet-home.tsx`, `@prisma/client`, `qa-login.ts`, `email.ts`, `insight-stats.ts`, `tarifs/page.tsx`, `new-card-toast.tsx`, `loyalty-service.test.ts`, `types.ts`, `platform-stats.ts`, `google-wallet/route.ts`, `fife-life/merchant-detail.tsx`, `ref_path`, `stripe-webhook-marketing.test.ts`, `stripe-webhook-route.test.ts`, `merchant-card-renderer.tsx`, `app/app/connexion/page.tsx`, `ref_node_path`, `unsubscribe-token.ts`, `qr-input.ts`, `stripe.ts`, `super-admin-session.ts`, `qr.ts`, `customer-reward-progress.ts`, `api-merchant-statistics-route.test.ts`, `lib/campaign-worker.ts`, `loyalty-commit.ts`, `campaign-worker.test.ts`, `campaign-crud-routes.test.ts`, `ad-confirm-route.test.ts`, `CardDeck`, `campaign-confirm-route.test.ts`, `sponsored-placements.test.ts`, `wallet-unlock.ts`, `campaign-quota.test.ts`, `webhook/route.ts`, `customer-notifications-route.test.ts`, `super-admin-campaign-moderation.test.ts`, `merchant-ad-edit.test.ts`, `landing-page.test.ts`, `campaign-test-mode-isolation.test.ts`, `push-client.ts`, `customer-push-route.test.ts`, `statistiques-scroll.test.ts`, `caisse-scan.test.ts`, `employee-invitation-service.ts`, `marketing-topup-route.test.ts`, `customer-preferences-route.test.ts`, `sponsored-hours-pricing.ts`, `super-admin-ad-moderation.test.ts`?**
  _High betweenness centrality (0.149) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `[id]/merchant-detail.tsx`, `cashier-checkout.tsx`, `merchant-card-template-service.ts`, `env.ts`, `components/ui.tsx`, `qa-login/page.tsx`, `loyalty-widget-view.tsx`, `card-editor-properties.tsx`, `loyalty-context.ts`, `merchant-ui.tsx`, `clients/ui.tsx`, `profile-page.tsx`, `app/ui.tsx`, `ad-detail.tsx`, `advantages-ui.tsx`, `solde/ui.tsx`, `card-editor.tsx`, `package.json`, `google-wallet-media-crop.tsx`, `statistiques-panel.tsx`, `scan/ui.tsx`, `invitation/page.tsx`, `card-template-schema.ts`, `src/app/page.tsx`, `wallet-home.tsx`, `tarifs/page.tsx`, `new-card-toast.tsx`, `types.ts`, `fife-life/merchant-detail.tsx`, `merchant-roulette.tsx`, `merchant-card-renderer.tsx`, `landing-header.tsx`, `campagnes/ui.tsx`, `programme/ui.tsx`, `notifications-center.tsx`, `layout-client.tsx`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _938 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `caisse-scan.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1402116402116402 - nodes in this community are weakly interconnected._
- **Should `rbac.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13438735177865613 - nodes in this community are weakly interconnected._
- **Should `merchant-card-template-service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06151062867480778 - nodes in this community are weakly interconnected._