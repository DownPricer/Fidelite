# Graph Report - Cartefidelité  (2026-10-02)

## Corpus Check
- 704 files · ~4,801,332 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: (none) 6, .example 4, .css 4)

## Summary
- 3930 nodes · 12212 edges · 194 communities (163 shown, 31 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 46 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8d207519`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- caisse-scan.ts
- @prisma/client
- rbac.ts
- merchant-card-template-service.ts
- sponsored-hours-pricing.ts
- react
- loyalty-program.ts
- firstActiveStaffMembership
- getSessionUser
- loyalty-widget-view.tsx
- loyalty-widget.ts
- validation.ts
- VisualPicker
- card-editor-properties.tsx
- requireMutatingRequest
- requireMerchantAdmin
- merchant-billing.ts
- customer-onboarding.ts
- cn
- ad-visual-workflow.ts
- clients/ui.tsx
- src/app/layout.tsx
- layout-shell.tsx
- google-wallet.ts
- google-auth.ts
- middleware.ts
- demo-routing.test.ts
- http.ts
- fiche.tsx
- SettingsPanel
- customer-reward-progress.ts
- create-super-admin.ts
- programme/ui.tsx
- card-editor.tsx
- package.json
- [id]/merchant-detail.tsx
- statistiques-panel.tsx
- ad-visuals.ts
- fake-ad-db.ts
- What You Must Do When Invoked
- scan/ui.tsx
- media-storage.ts
- loyalty-commit.test.ts
- avatar-editor.tsx
- loyalty-commit.ts
- demo-session.ts
- src/app/page.tsx
- compilerOptions
- use-wallet-unlock-animation.ts
- loyalty-program-publication.ts
- super-admin.test.ts
- qa-login.ts
- ref_node_path
- dependencies
- loyaltyBalanceForMode
- email.ts
- devDependencies
- insight-stats.ts
- sponsored-slot.test.tsx
- resolveMediaFilePath
- card-enlarged-view.tsx
- api-guard.ts
- scripts
- facturation/ui.tsx
- platform-stats.ts
- AdDetailPage
- qr-cache.ts
- vitest
- stripe-webhook-marketing.test.ts
- stripe-webhook-route.test.ts
- google-wallet/route.ts
- demo-visual.ts
- merchant-card-renderer.tsx
- AdvantagesEditor
- qr-input.ts
- customer-qr-route.test.ts
- unsubscribe/route.ts
- generate-pwa-icons.mjs
- ads/[id]/confirm/route.ts
- stripe.ts
- next
- cartes.js
- Fideto
- docker-entrypoint.sh
- qr.ts
- EmployeeDetailPanel
- ad-visual-journeys.test.ts
- Notes pour le prochain agent - Carousel de cartes
- Cartes de fidélité — pack pour Cursor
- demo.js
- jsonError
- progress-ring.tsx
- semi-gauge.tsx
- campagnes/ui.tsx
- deploy.sh
- eslint.config.mjs
- next-env.d.ts
- postcss.config.mjs
- sw.js
- graphify reference: extra exports and benchmark
- wallet-home.tsx
- MerchantCampaignFiche
- profile-page.tsx
- loyalty-service.ts
- types.ts
- graphify reference: query, path, explain
- campaign-worker.test.ts
- requireSuperAdmin
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
- env.ts
- ad-confirm-route.test.ts
- interactive-loyalty-card.tsx
- campaign-confirm-route.test.ts
- sponsored-placements.test.ts
- cards-index.tsx
- cashier-checkout.tsx
- HourlySchedulePicker
- webhook/route.ts
- merchants-list.tsx
- scan-session.ts
- app/ui.tsx
- prisma.ts
- super-admin-campaign-moderation.test.ts
- MerchantDetailPage
- merchant-ad-edit.test.ts
- landing-page.test.ts
- resolvePublishedMerchantCardTemplate
- google-wallet-doctor.ts
- push-client.ts
- campaign-moderation-home.tsx
- campaign-fixes.test.ts
- admin-ad-fiche.test.ts
- wallet-hydration.test.tsx
- api-merchant-statistics-route.test.ts
- wallet-unlock.ts
- campaign-test-mode-isolation.test.ts
- loyalty-service.test.ts
- marketing-balance.test.ts
- caisse-scan.test.ts
- employee-invitation-service.ts
- preview-data.ts
- marketing-topup-route.test.ts
- super-admin-ad-moderation.test.ts
- sponsored-slot.tsx
- finalisation/page.tsx
- getActiveStripeMode
- lib/campaign-worker.ts
- push.ts
- caisse-scan-route.test.ts
- ad-detail.tsx
- preferences/route.ts
- staff-permissions.ts
- CreateMerchantWizard
- qa-login/page.tsx
- card-deck.tsx
- sponsored-selection.ts
- SettingsPage
- scripts/campaign-worker.ts
- loyalty-reward-removal.ts
- EmployeeLoginScreen
- app/statistiques/page.tsx
- landing-footer.tsx
- card-template-schema.ts
- campaign-quota.test.ts
- loyalty-cards-capture.mjs
- subscriptions-home.tsx
- invitation/page.tsx
- avatar-storage.ts
- capture-employe-screenshots.mjs
- landing-header.tsx
- CardEditorBackgroundCrop
- demo/page.tsx
- ref_fs_promises
- ref_motion_react
- ref_next_font_google
- ref_next_headers
- ref_next_link
- ref_next_navigation
- ref_next_server
- ref_node_fs_promises
- ref_react_dom_client
- ref_react_dom_server
- ref_vitest_config

## God Nodes (most connected - your core abstractions)
1. `jsonError()` - 255 edges
2. `jsonOk()` - 221 edges
3. `next` - 160 edges
4. `requireMutatingRequest()` - 158 edges
5. `prisma` - 147 edges
6. `vitest` - 119 edges
7. `clientIp()` - 117 edges
8. `readJson()` - 113 edges
9. `react` - 110 edges
10. `userAgent()` - 108 edges

## Surprising Connections (you probably didn't know these)
- `loop()` --calls--> `runWorkerTick()`  [EXTRACTED]
  scripts/campaign-worker.ts → src/lib/campaign-worker.ts
- `main()` --calls--> `getActiveMerchantLoyaltyContext()`  [EXTRACTED]
  scripts/diagnose-loyalty-program.ts → src/lib/loyalty-context.ts
- `approvedAd()` --calls--> `PATCH()`  [EXTRACTED]
  tests/campaign-fixes.test.ts → src/app/api/merchant/ads/[id]/route.ts
- `submit()` --indirect_call--> `schedule()`  [INFERRED]
  src/app/app/campagnes/ui.tsx → tests/ad-visual-journeys.test.ts
- `legacyHeavyConfig()` --calls--> `defaultCardTemplateConfig()`  [EXTRACTED]
  tests/card-editor-legacy-reset.test.ts → src/lib/card-template-schema.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (194 total, 31 thin omitted)

### Community 0 - "caisse-scan.ts"
Cohesion: 0.14
Nodes (19): buildScanResult(), CaisseScanError, maskClientNumberForLog(), findUserByCustomerNumber(), processCaisseScan(), processCaisseScanByClientNumber(), deriveClientNumber(), formatClientNumberDisplay() (+11 more)

### Community 1 - "@prisma/client"
Cohesion: 0.13
Nodes (32): @prisma/client, formatAddress(), MerchantProfile(), join(), MerchantProfileData, safeExternalUrl(), buildProgramSnapshot(), buildProgramSnapshotFromContext() (+24 more)

### Community 2 - "rbac.ts"
Cohesion: 0.12
Nodes (23): CaissePage(), DashboardLayout(), hasMerchantStaffAccess(), isMerchantAppPublicPath(), MERCHANT_APP_PUBLIC_PATHS, resolveMerchantAppAccess(), shouldRedirectAppToEmployeeSpace(), assertCanAddEmployee() (+15 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.07
Nodes (52): LegacyCardEditorRedirect(), ALL_MERCHANT_CARD_SLOTS, CARD_SLOT_SLUGS, CARD_SLOT_TITLES, cardSlotEditorPath(), cardSlotForLoyaltyMode(), loyaltyModeForCardSlot(), merchantCardsGalleryPath() (+44 more)

### Community 4 - "sponsored-hours-pricing.ts"
Cohesion: 0.15
Nodes (15): GET(), POST(), computeAdLifecycleStatus(), parisHourInstant(), isWithinUtcIntervals(), MAX_SPONSORED_DAYS, MIN_HOURS_PER_DAY, MIN_SPONSORED_DAYS (+7 more)

### Community 5 - "react"
Cohesion: 0.08
Nodes (30): react, Merchant, MerchantPublic(), CustomerLoginForm(), googleMessage(), recoverMessage(), FormState, ChangePasswordPage() (+22 more)

### Community 6 - "loyalty-program.ts"
Cohesion: 0.10
Nodes (33): block(), buildNextBenefit(), centsToEarnAtLeast(), EarnEvaluation, EarnHistory, evaluateEarn(), formatDurationMinutes(), LoyaltyAction (+25 more)

### Community 7 - "firstActiveStaffMembership"
Cohesion: 0.17
Nodes (25): CampagneFichePage(), CampagnesPage(), SoldeMarketingPage(), EmployeeDetailPage(), EmployeesPage(), FidelisationPage(), FidelisationPanel(), FacturationPage() (+17 more)

### Community 8 - "getSessionUser"
Cohesion: 0.24
Nodes (8): EmployeeLoginPage(), ProEntryPage(), SPACES, getEmployeeSession(), LandingAuthTargets, resolveLandingAuthTargets(), getSessionUser(), { getSessionUserMock, getEmployeeSessionMock }

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.12
Nodes (19): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetProgressInput, LoyaltyWidgetView(), pct(), ProgressCircle() (+11 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.07
Nodes (47): LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), dedupeIssues(), EditorValidationIssue, EditorValidationSummary, missingWidgetLabel(), publishValidationResult(), summarizeEditorValidation() (+39 more)

### Community 11 - "validation.ts"
Cohesion: 0.06
Nodes (35): FILTER_MAP, GET(), GET(), sortOrder(), GET(), loadProgram(), formatFifeLifeEntry(), balanceFieldForUnit() (+27 more)

### Community 12 - "VisualPicker"
Cohesion: 0.19
Nodes (13): deleteCampaignMediaUrl(), loadImageElement(), readFileAsDataUrl(), SelfVisualCropper(), uploadCampaignMedia(), VisualPicker(), dropSelfFiles(), onCropConfirm() (+5 more)

### Community 13 - "card-editor-properties.tsx"
Cohesion: 0.07
Nodes (65): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, GuideLine, handlesForElement() (+57 more)

### Community 14 - "requireMutatingRequest"
Cohesion: 0.11
Nodes (52): POST(), POST(), schema, POST(), logScanBody(), POST(), scanVia(), POST() (+44 more)

### Community 15 - "requireMerchantAdmin"
Cohesion: 0.14
Nodes (24): EDITABLE_STATUSES, PATCH(), GET(), POST(), POST(), DELETE(), GET(), loadOwnedCampaign() (+16 more)

### Community 16 - "merchant-billing.ts"
Cohesion: 0.10
Nodes (29): GET(), attachReceipts(), BillingError, CANCELLABLE, CancellationPreview, effectiveEndDate(), InvoicesResult, listMerchantInvoices() (+21 more)

### Community 17 - "customer-onboarding.ts"
Cohesion: 0.08
Nodes (44): POST(), GET(), POST(), POST(), schema, GET(), POST(), DELETE() (+36 more)

### Community 18 - "cn"
Cohesion: 0.10
Nodes (24): DEMO, Employee, EmployeesPanel(), formatActivity(), statusBadgeLabel(), statusTone(), DashboardLayout(), AppNav() (+16 more)

### Community 19 - "ad-visual-workflow.ts"
Cohesion: 0.09
Nodes (33): GET(), POST(), schema, GET(), GET(), PATCH(), PROPOSABLE, schema (+25 more)

### Community 20 - "clients/ui.tsx"
Cohesion: 0.12
Nodes (18): CustomerDetailPage(), ClientsPage(), Customer, CustomerDetail, CustomerDetailPanel(), CustomerInsight, CustomersPanel(), CustomerStats (+10 more)

### Community 21 - "src/app/layout.tsx"
Cohesion: 0.14
Nodes (9): next-themes, src_app_globals, dynamic, manrope, metadata, viewport, PwaRegister(), THEME_COLOR (+1 more)

### Community 22 - "layout-shell.tsx"
Cohesion: 0.08
Nodes (22): recharts, MerchantCardsPage(), ACTIVITY_LABELS, DashboardHome(), formatEuros(), Overview, QUICK_LINKS, SuperAdminStatsPage() (+14 more)

### Community 23 - "google-wallet.ts"
Cohesion: 0.15
Nodes (33): isGoogleWalletConfigured(), accessToken(), assertConfigured(), buildGoogleWalletIds(), classProfileForMode(), createGlobalGoogleWalletSaveUrl(), createMerchantGoogleWalletSaveUrl(), customerQrValue() (+25 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.06
Nodes (49): GET(), GET(), AppLoginPage(), CarteLayout(), CompteLayout(), CustomerLoginPage(), CustomerSignupPage(), CustomerSignupForm() (+41 more)

### Community 25 - "middleware.ts"
Cohesion: 0.14
Nodes (24): isProduction(), hostMatches(), hostnameOf(), isAdminHost(), isAppHost(), isCustomerHost(), isEmployeeHost(), isLocalHost() (+16 more)

### Community 26 - "demo-routing.test.ts"
Cohesion: 0.13
Nodes (15): CaisseAliasPage(), EmployeeHomePage(), EmployeeScanPage(), EMPLOYEE_DEMO_COOKIE, isClientDemoMode(), isDemoCookie(), isPublicDemoEnabled(), MERCHANT_DEMO_COOKIE (+7 more)

### Community 27 - "http.ts"
Cohesion: 0.11
Nodes (22): zod, POST(), dynamic, logCustomerQr(), POST(), runtime, schema, POST() (+14 more)

### Community 28 - "fiche.tsx"
Cohesion: 0.12
Nodes (19): AdStatus, Detail, euros(), HistoryRow, PaymentPreview, PayMethod, STATUS_LABELS, block (+11 more)

### Community 30 - "customer-reward-progress.ts"
Cohesion: 0.22
Nodes (13): MerchantRewardProgressPanel(), TargetBlock(), buildTargetView(), resolveVisualState(), CustomerMerchantRewardProgress, MerchantRewardProgressTarget, REWARD_ALMOST_THRESHOLD_PERCENT, RewardProgressVisualState (+5 more)

### Community 31 - "create-super-admin.ts"
Cohesion: 0.50
Nodes (4): bcryptjs, main(), prisma, required()

### Community 32 - "programme/ui.tsx"
Cohesion: 0.08
Nodes (31): DEMO_CONFIG, HistoricalEntitlement, DEMO_CONFIG, MODES, modeTitle(), PROGRAM_STEPS, ProgramConfigurator(), goToStep() (+23 more)

### Community 33 - "card-editor.tsx"
Cohesion: 0.10
Nodes (35): buildElementCatalog(), CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction() (+27 more)

### Community 34 - "package.json"
Cohesion: 0.08
Nodes (25): description, engines, node, name, prisma, seed, private, version (+17 more)

### Community 35 - "[id]/merchant-detail.tsx"
Cohesion: 0.16
Nodes (18): MEDIA_TO_APPEARANCE_KEY, RECOMMENDED_WALLET_COLORS, WalletAppearance, WalletMediaKey, WalletMediaPreview, WalletPreviewView, GoogleWalletMediaCrop(), confirm() (+10 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.10
Nodes (29): ApiResponse, COMPARISON_METRICS, FideliteTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder, MAX_COMPARISON_METRICS (+21 more)

### Community 37 - "ad-visuals.ts"
Cohesion: 0.10
Nodes (33): GET(), GET(), AD_SOURCE_MAX_IMAGES, AD_VISUAL_EXPORT_PX, AD_VISUAL_MAX_BYTES, AD_VISUAL_MAX_PX, AD_VISUAL_MIN_PX, AD_VISUAL_RATIO (+25 more)

### Community 38 - "fake-ad-db.ts"
Cohesion: 0.18
Nodes (14): END, fake, h, START, applyUpdate(), createFakeAdDb(), hydrate(), model() (+6 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "scan/ui.tsx"
Cohesion: 0.13
Nodes (19): ADMIN_PERMISSIONS, CaisseScreen(), ScanResult, EmployeeProfile, EmployeeScanScreen(), Phase, ScanResult, statusLabel() (+11 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.13
Nodes (27): GET(), notFound(), appearanceKeyForGoogleWalletMedia(), assertExactDimensions(), deleteCardBackground(), getUploadsRoot(), GoogleWalletMediaKind, GoogleWalletPublicMediaKind (+19 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "avatar-editor.tsx"
Cohesion: 0.47
Nodes (5): AvatarFileInput(), AvatarPreviewEditor(), cropCircleToDataUrl(), loadImage(), useAvatarEditor()

### Community 44 - "loyalty-commit.ts"
Cohesion: 0.09
Nodes (43): FinancesTab(), getCustomerMerchantRewardProgress(), appliedTierLabel(), assembleView(), buildView(), commitLoyaltyTransaction(), customerName(), evaluateCustomerRewards() (+35 more)

### Community 45 - "demo-session.ts"
Cohesion: 0.15
Nodes (20): GET(), GET(), GET(), GET(), GET(), demoCookieNamesForRole(), demoEnterTarget(), DemoRole (+12 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.07
Nodes (36): BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, HomePage(), MERCHANT_BENEFITS, metadata, PROOF_ITEMS, ArrowRightIcon() (+28 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "use-wallet-unlock-animation.ts"
Cohesion: 0.14
Nodes (26): useWalletEvents(), connect(), disconnect(), onVisibility(), isDocumentVisible(), UnlockRevealPhase, useWalletUnlockAnimation(), flushWhenVisible() (+18 more)

### Community 49 - "loyalty-program-publication.ts"
Cohesion: 0.16
Nodes (21): activeEligibleRewards(), assertRewardLimit(), countConfiguredRewards(), createAcquiredRewardEntitlements(), LoyaltyDraftReward, LoyaltyProgramDraft, MAX_CONFIGURED_REWARDS, ModeChangeDecision (+13 more)

### Community 50 - "super-admin.test.ts"
Cohesion: 0.30
Nodes (11): BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr(), sumCollectedRevenue() (+3 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.09
Nodes (36): ref_crypto, assertNoUnknownArgs(), main(), parseTtlMinutes(), GET(), POST(), QaExchangeBody, qaJson() (+28 more)

### Community 52 - "ref_node_path"
Cohesion: 0.05
Nodes (24): ref_node_fs, ref_node_path, playwright, outDir, pages, OUT, OUT, shots (+16 more)

### Community 53 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+11 more)

### Community 54 - "loyaltyBalanceForMode"
Cohesion: 0.17
Nodes (25): main(), dynamic, GET(), GET(), CarteIndexPage(), dynamic, CardPage(), dynamic (+17 more)

### Community 55 - "email.ts"
Cohesion: 0.21
Nodes (20): buildCampaignEmailContent(), buildCustomerFinalizationContent(), buildInvitationContent(), CampaignEmailInput, CustomerFinalizationEmailInput, emailConfigHint(), EmailSendResult, EmployeeInvitationEmailInput (+12 more)

### Community 56 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, eslint-config-next, happy-dom, playwright, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+8 more)

### Community 57 - "insight-stats.ts"
Cohesion: 0.08
Nodes (58): addParisDays(), addParisMonths(), bucketKey(), enumerateBucketKeys(), enumerateDayKeys(), enumerateMonthKeys(), enumerateWeekKeys(), InsightBucket (+50 more)

### Community 58 - "sponsored-slot.test.tsx"
Cohesion: 0.12
Nodes (9): MobilePlacementPreview(), AD, calls, FakeIntersectionObserver, flush(), mount(), Observer, observers (+1 more)

### Community 59 - "resolveMediaFilePath"
Cohesion: 0.38
Nodes (5): GET(), MIME, GET(), MIME, resolveMediaFilePath()

### Community 60 - "card-enlarged-view.tsx"
Cohesion: 0.11
Nodes (21): motion, react-dom, CardEnlargedView(), CardEnlargedViewProps, isFifeLifeCard(), CardsSheet(), DiscoverPage(), Merchant (+13 more)

### Community 61 - "api-guard.ts"
Cohesion: 0.15
Nodes (22): GET(), POST(), GET(), GET(), PERIOD_KEYS, requireEmployee(), requireMerchantStatsAccess(), staffContext() (+14 more)

### Community 62 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:migrate, db:migrate:dev, db:seed, db:studio, dev, icons (+6 more)

### Community 63 - "facturation/ui.tsx"
Cohesion: 0.19
Nodes (14): api(), BillingPanel(), confirmCancellation(), openPortal(), startCancellation(), Cancellation, day(), Invoice (+6 more)

### Community 64 - "platform-stats.ts"
Cohesion: 0.23
Nodes (15): GET(), GET(), PERIODS, dateKey(), fillDailySeries(), getPlatformAlerts(), getPlatformBreakdowns(), getPlatformOverview() (+7 more)

### Community 65 - "AdDetailPage"
Cohesion: 0.22
Nodes (12): AdDetailPage(), confirmReason(), patch(), requestSend(), run(), sendProposal(), api(), formatCents() (+4 more)

### Community 66 - "qr-cache.ts"
Cohesion: 0.17
Nodes (17): MerchantInteractiveCard(), MerchantInteractiveCardProps, PREVIEW_QR, QrBlock(), cache, cacheKey(), failedOnce, fetchCustomerQr() (+9 more)

### Community 67 - "vitest"
Cohesion: 0.06
Nodes (21): ref_fs, ref_os, ref_path, vitest, main(), outDir, shot(), outDir (+13 more)

### Community 68 - "stripe-webhook-marketing.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent, creditTopup (+5 more)

### Community 69 - "stripe-webhook-route.test.ts"
Cohesion: 0.11
Nodes (15): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindFirst, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent (+7 more)

### Community 70 - "google-wallet/route.ts"
Cohesion: 0.14
Nodes (24): ensureWalletClassRecord(), parseWalletAction(), POST(), publishedMediaExists(), schema, validateAppearanceColor(), contrastWithWhite(), GOOGLE_WALLET_RECOMMENDED_COLORS (+16 more)

### Community 71 - "demo-visual.ts"
Cohesion: 0.17
Nodes (18): CarteIdentitePage(), AccountPage(), ParametresPage(), PREVIEW_HISTORY, getProfileUser(), DEMO_LOYALTY_OVERVIEW, CLIENT_DEMO_COOKIE, src_lib_demo_visual_client_demo_cookie (+10 more)

### Community 72 - "merchant-card-renderer.tsx"
Cohesion: 0.11
Nodes (32): CardTemplateBackground(), COMPACT_HIDDEN, elementShellStyle(), ElementView(), MerchantCardDisplayMode, MerchantCardRendererProps, resolveDisplayQrSrc(), shouldHideElement() (+24 more)

### Community 73 - "AdvantagesEditor"
Cohesion: 0.26
Nodes (16): AdvantagesEditor(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward(), openEditReward() (+8 more)

### Community 74 - "qr-input.ts"
Cohesion: 0.43
Nodes (5): ALLOWED_QR_HOSTS, extractFifeLifeQrToken(), extractJwtFromText(), QrInputError, readManualToken()

### Community 75 - "customer-qr-route.test.ts"
Cohesion: 0.29
Nodes (5): generateCustomerQrDataUrl, isCustomerQrInfrastructureError, requireMutatingRequest, requireUser, tryEnsureCustomerMembershipForSlug

### Community 76 - "unsubscribe/route.ts"
Cohesion: 0.20
Nodes (13): jose, bodySchema, POST(), sendOneDeliveryUnsafe(), recordConsentEvents(), secretKey(), signUnsubscribeToken(), UnsubscribePayload (+5 more)

### Community 77 - "generate-pwa-icons.mjs"
Cohesion: 0.16
Nodes (12): ref_node_buffer, ref_node_url, ref_node_zlib, outDir, outFile, root, chunk(), color (+4 more)

### Community 78 - "ads/[id]/confirm/route.ts"
Cohesion: 0.15
Nodes (33): billingCustomer(), computeAdPricing(), GET(), InsufficientBalance, pendingCheckout(), POST(), QuotaExhausted, POST() (+25 more)

### Community 79 - "stripe.ts"
Cohesion: 0.10
Nodes (30): stripe, BillingCustomerInput, billingParams(), CampaignCheckoutInput, checkoutExpiry(), clientForMode(), clients, constructStripeWebhookEvent() (+22 more)

### Community 80 - "next"
Cohesion: 0.06
Nodes (31): nextConfig, next, metadata, viewport, AuditPage(), SuperAdminAuditPage(), Check, DiagnosticPage() (+23 more)

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

### Community 86 - "ad-visual-journeys.test.ts"
Cohesion: 0.15
Nodes (14): submit(), adminPropose(), createAd(), ctx(), dataUrl(), fake, h, jsonRequest() (+6 more)

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "jsonError"
Cohesion: 0.07
Nodes (71): GET(), PATCH(), GET(), POST(), POST(), POST(), POST(), POST() (+63 more)

### Community 93 - "campagnes/ui.tsx"
Cohesion: 0.05
Nodes (40): historyDateKey(), HistoryFilter, matchesFilter(), SoldeMarketingPanel(), topup(), AD_STATUS_LABELS, AdRequest, AdStatus (+32 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "wallet-home.tsx"
Cohesion: 0.06
Nodes (45): AddToGoogleWalletButton(), DiscoverIconLink(), NotificationBellLink(), CustomerProgramView, DETAIL_TABS, DetailTabId, EMPTY_RECENT_ACTIVITY, MerchantCardDetail() (+37 more)

### Community 102 - "MerchantCampaignFiche"
Cohesion: 0.35
Nodes (10): api(), MerchantCampaignFiche(), addSources(), onFile(), onFramed(), post(), onFileChosen(), isExactBanner() (+2 more)

### Community 103 - "profile-page.tsx"
Cohesion: 0.16
Nodes (21): GlassBottomSheet(), SheetAction(), HistoryFilter, ProfilePage(), patchProfile(), saveNameEdit(), APP_VERSION, APPEARANCE_OPTIONS (+13 more)

### Community 104 - "loyalty-service.ts"
Cohesion: 0.13
Nodes (21): assertEarnProgramRules(), employeeCookieName(), employeeTokenFromRequest(), hasEmployeeCookie(), applyAdjustment(), applyEarnVisit(), applyRedeemReward(), incrementBalanceData() (+13 more)

### Community 105 - "types.ts"
Cohesion: 0.14
Nodes (11): LinearGauge(), MerchantCardPublicPreview(), displayClientName(), MerchantCardRenderer(), MerchantFace(), MerchantRoulette(), MerchantCardData, PublicMerchant (+3 more)

### Community 106 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 107 - "campaign-worker.test.ts"
Cohesion: 0.12
Nodes (15): baseCampaign, campaignDeliveryCount, campaignDeliveryCreateMany, campaignDeliveryFindMany, campaignDeliveryUpdate, campaignUpdate, customerMembershipFindMany, customerPreferencesFindMany (+7 more)

### Community 108 - "requireSuperAdmin"
Cohesion: 0.10
Nodes (25): GET(), GET(), GET(), GET(), POST(), GET(), DELETE(), PATCH() (+17 more)

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
Cohesion: 0.19
Nodes (10): dynamic, NotificationsPage(), DEMO_NOTIFICATIONS, kindLabel(), NotificationItem, NotificationKind, NotificationMerchant, NotificationsCenter() (+2 more)

### Community 118 - "campaign-crud-routes.test.ts"
Cohesion: 0.20
Nodes (8): campaignCreate, campaignFindFirst, campaignFindMany, campaignUpdate, refundCampaignDebit, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 120 - "env.ts"
Cohesion: 0.13
Nodes (8): dynamic, dynamic, assertSameOrigin(), CsrfError, env, getAllowedOrigins(), MerchantAppAccess, adminMembership

### Community 121 - "ad-confirm-route.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindFirst, adRequestUpdate, adRequestUpdateMany, campaignUpdate, createCampaignCheckoutSession, executeRaw, FakeStripeNotConfiguredError, getQuotaUsage (+5 more)

### Community 122 - "interactive-loyalty-card.tsx"
Cohesion: 0.13
Nodes (19): InteractiveLoyaltyCard(), InteractiveLoyaltyCardProps, LADDER, TIER_STYLE, WalletTier, DEMO_TIER_DECK_ORDER, getLoyaltyCardBackground(), getLoyaltyCardTierLabel() (+11 more)

### Community 123 - "campaign-confirm-route.test.ts"
Cohesion: 0.12
Nodes (17): baseCampaign, campaignFindFirst, campaignUpdate, campaignUpdateMany, debitForCampaign, estimateMerchantMembersAudience, estimateNetworkLocalAudience, getMarketingBalanceCents (+9 more)

### Community 124 - "sponsored-placements.test.ts"
Cohesion: 0.14
Nodes (18): GET(), GET(), previewResponse(), isSafeAdUrl(), loadAdPreviewCard(), parsePlacement(), selectSponsoredForCustomer(), publicSponsored() (+10 more)

### Community 125 - "cards-index.tsx"
Cohesion: 0.29
Nodes (9): ALL_SLOTS, cardCounts(), CardsIndexPage(), hasPublishedActiveSlot(), MerchantCardRow, modeLabel(), pickCurrentTemplate(), statusLabel() (+1 more)

### Community 126 - "cashier-checkout.tsx"
Cohesion: 0.18
Nodes (17): AmountField(), press(), KEYS, CashierCheckout(), askRedeem(), commitEarn(), confirmRedeem(), Phase (+9 more)

### Community 127 - "HourlySchedulePicker"
Cohesion: 0.18
Nodes (17): addDaysToDateInput(), defaultSlotFor(), firstSelectableDate(), formatHourRange(), HourlySchedulePicker(), addDay(), hourSelectOptions(), hoursToSlots() (+9 more)

### Community 128 - "webhook/route.ts"
Cohesion: 0.16
Nodes (20): handleChargeRefunded(), handleCheckoutSessionCompleted(), handleCheckoutSessionExpired(), handlePaymentIntentFailed(), handleStripeEvent(), paymentIntentIdOf(), POST(), isCancellable() (+12 more)

### Community 129 - "merchants-list.tsx"
Cohesion: 0.18
Nodes (12): formatActivity(), MerchantRow, MerchantsListPage(), modeLabel(), pickPreviewTemplate(), statusLabel(), ACTION_DESCRIPTION, ACTION_LABEL (+4 more)

### Community 130 - "scan-session.ts"
Cohesion: 0.29
Nodes (15): formatCameraError(), QrScanner(), onDecode(), CAISSE_SCAN_PATH, CAMERA_START_TIMEOUT_MS, finalizeCameraStart(), formatRetryAfter(), INSTANT_DUPLICATE_MS (+7 more)

### Community 131 - "app/ui.tsx"
Cohesion: 0.18
Nodes (6): HomeStats, KPI_ICONS, MerchantHome(), QUICK_ACTIONS, StatsPreview, TrendMetric

### Community 132 - "prisma.ts"
Cohesion: 0.13
Nodes (24): schema, GET(), mapEmployee(), PATCH(), employeeLoginUrl(), GET(), mapEmployee(), POST() (+16 more)

### Community 133 - "super-admin-campaign-moderation.test.ts"
Cohesion: 0.18
Nodes (9): campaignFindUnique, campaignPaymentUpdate, campaignUpdate, refundCampaignDebit, refundCampaignPayment, refundIncludedQuota, requireMutatingRequest, requireSuperAdmin (+1 more)

### Community 134 - "MerchantDetailPage"
Cohesion: 0.21
Nodes (6): MerchantDetailPage(), clearWalletLocalPreviews(), reloadMerchant(), saveWalletDraft(), walletAction(), revokeWalletPreviews()

### Community 135 - "merchant-ad-edit.test.ts"
Cohesion: 0.22
Nodes (6): adRequestFindFirst, adRequestUpdate, campaignUpdate, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 136 - "landing-page.test.ts"
Cohesion: 0.18
Nodes (9): authTargets, connexionUi, faq, footer, header, heroVisual, page, proPage (+1 more)

### Community 137 - "resolvePublishedMerchantCardTemplate"
Cohesion: 0.21
Nodes (12): GET(), LOYALTY_MODES, GET(), dynamic, MerchantProfilePage(), getPublishedCardTemplate(), logMerchantCardSwitch(), MerchantCardSwitchContext (+4 more)

### Community 138 - "google-wallet-doctor.ts"
Cohesion: 0.20
Nodes (17): google-auth-library, accessToken(), fail(), main(), ok(), pngSize(), appLinkData(), classTemplateInfo() (+9 more)

### Community 139 - "push-client.ts"
Cohesion: 0.39
Nodes (5): enablePushNotifications(), getPushSupportState(), isIosNotStandalone(), PushSupportState, urlBase64ToUint8Array()

### Community 140 - "campaign-moderation-home.tsx"
Cohesion: 0.20
Nodes (8): AD_STATUS_FILTER_OPTIONS, AD_STATUS_LABELS, AdRequest, AdStatus, CampaignModerationHome(), formatCents(), NetworkCampaign, RejectTarget

### Community 141 - "campaign-fixes.test.ts"
Cohesion: 0.25
Nodes (13): approvedAd(), asAdmin(), asMerchant(), ctx(), dataUrl(), fake, futureSchedule(), h (+5 more)

### Community 142 - "admin-ad-fiche.test.ts"
Cohesion: 0.14
Nodes (12): ref_sharp, files, INPUT_DIR, adminStage(), createAd(), ctx(), fake, h (+4 more)

### Community 143 - "wallet-hydration.test.tsx"
Cohesion: 0.17
Nodes (11): DEMO_TIER_POINTS, GlobalCard(), GlobalCardMode, loyaltyCardDisplayName(), CardHistoryItem, historyLabel(), UniversalDetail(), DEMO_CLIENT_NUMBER (+3 more)

### Community 144 - "api-merchant-statistics-route.test.ts"
Cohesion: 0.20
Nodes (8): findUniqueSubscription, FREE_STATS, getFreeMerchantStats, getInsightPremium, getLockedInsightPlaceholder, REAL_PLACEHOLDER, REAL_PREMIUM, requireMerchantStatsAccess

### Community 145 - "wallet-unlock.ts"
Cohesion: 0.19
Nodes (15): dynamic, GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), runtime, sseChunk(), cardFromUnlockEvent() (+7 more)

### Community 146 - "campaign-test-mode-isolation.test.ts"
Cohesion: 0.13
Nodes (14): adEventCreate, adRequestFindMany, adRequestFindUnique, campaignDeliveryCreateMany, campaignUpdate, customerMembershipFindMany, customerPreferencesFindMany, inAppNotificationCreate (+6 more)

### Community 147 - "loyalty-service.test.ts"
Cohesion: 0.14
Nodes (13): activeProgram, baseMembership, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeLedgerCreate, loyaltyProgramFindUnique (+5 more)

### Community 148 - "marketing-balance.test.ts"
Cohesion: 0.31
Nodes (7): Entry, makeTx(), Mode, snapshot(), state, transaction(), uniqueViolation()

### Community 149 - "caisse-scan.test.ts"
Cohesion: 0.13
Nodes (14): caisseGrantCreate, customerMembershipCreate, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeQrTokenFindUnique, fifeLifeQrTokenUpdate (+6 more)

### Community 150 - "employee-invitation-service.ts"
Cohesion: 0.17
Nodes (19): GET(), POST(), buildInvitationLink(), canEmployeeAccess(), createInvitationToken(), hashInvitationToken(), INVITATION_ERROR, invitationExpiryDate() (+11 more)

### Community 151 - "preview-data.ts"
Cohesion: 0.13
Nodes (14): PREVIEW_BENEFITS, PREVIEW_CARDS, PREVIEW_PREFERENCES, PREVIEW_PROFILE, PREVIEW_PROFILE_HISTORY, resetQrCache(), BenefitEntry, formatLoyaltyEntry() (+6 more)

### Community 152 - "marketing-topup-route.test.ts"
Cohesion: 0.07
Nodes (21): inAppNotificationCount, inAppNotificationFindMany, inAppNotificationUpdateMany, requireMutatingRequest, requireUser, pushSubscriptionDeleteMany, pushSubscriptionUpsert, requireMutatingRequest (+13 more)

### Community 153 - "super-admin-ad-moderation.test.ts"
Cohesion: 0.22
Nodes (6): adRequestFindUnique, adRequestUpdate, campaignUpdate, requireMutatingRequest, requireSuperAdmin, writeAudit

### Community 154 - "sponsored-slot.tsx"
Cohesion: 0.23
Nodes (11): IMAGE_CLASS, SponsoredAd, SponsoredBanner(), SponsoredVariant, getDismissedAds(), rememberDismissed(), reportedThisSession, resetSponsoredSessionState() (+3 more)

### Community 155 - "finalisation/page.tsx"
Cohesion: 0.26
Nodes (7): FinalisationPage(), FinalisationForm(), resolveCustomerAccessLevel(), isSmsConfigured(), sendSms(), smsConfigHint(), SmsSendResult

### Community 156 - "getActiveStripeMode"
Cohesion: 0.39
Nodes (9): main(), GET(), GET(), diagnoseAdDelivery(), selectSponsoredForCustomerDebug, getActiveStripeMode(), isPaymentAllowedForMerchant(), KEY_PREFIXES (+1 more)

### Community 157 - "lib/campaign-worker.ts"
Cohesion: 0.29
Nodes (11): networkAudienceWhere(), backoffMinutesForAttempt(), claimNextScheduledCampaign(), deliveryChannelsFor(), finalizeCampaignIfComplete(), materializeDeliveries(), processPendingDeliveries(), runWorkerTick() (+3 more)

### Community 158 - "push.ts"
Cohesion: 0.29
Nodes (8): web-push, isWebPushConfigured(), ensureConfigured(), PushPayload, PushSendResult, sendPushToSubscription(), sendPushToUser(), WebPushNotConfiguredError

### Community 159 - "caisse-scan-route.test.ts"
Cohesion: 0.25
Nodes (6): processCaisseScan, processCaisseScanByClientNumber, rateLimit, requireCaisse, requireMutatingRequest, writeAudit

### Community 160 - "ad-detail.tsx"
Cohesion: 0.11
Nodes (17): AdRequestDetail, AdStatus, AUDIT_LABELS, AuditRow, Delivery, Draft, Journey, PLACEMENT_LABELS (+9 more)

### Community 161 - "preferences/route.ts"
Cohesion: 0.15
Nodes (16): GET(), PATCH(), CONSENT_FIELDS, CONSENT_POLICY_VERSION, ConsentField, extractConsentChanges(), ensureCustomerPreferences(), serializePreferences() (+8 more)

### Community 162 - "staff-permissions.ts"
Cohesion: 0.20
Nodes (8): ADMIN_PERMISSIONS, CASHIER_DEFAULT, CRITICAL_PERMISSION_KEYS, EMPLOYEE_FIXED_PERMISSIONS, MANAGER_DEFAULT, PERMISSION_KEYS, PERMISSION_LABELS, PermissionKey

### Community 163 - "CreateMerchantWizard"
Cohesion: 0.50
Nodes (3): CreateMerchantWizard(), goNext(), stepError()

### Community 164 - "qa-login/page.tsx"
Cohesion: 0.38
Nodes (4): dynamic, QaLoginPage(), QaLoginClient(), readFragmentToken()

### Community 165 - "card-deck.tsx"
Cohesion: 0.20
Nodes (12): activeCardFromDeck(), CardDeck(), handleCardExpand(), handleDragEnd(), handleKeyDown(), snapTo(), DeckItem, demoStartIndex() (+4 more)

### Community 166 - "sponsored-selection.ts"
Cohesion: 0.12
Nodes (24): AdCandidate, CustomerZone, DeliveryCheck, evaluateCampaignChecks(), GLOBAL_COOLDOWN_MS, IMPRESSION_DEDUPE_MS, inAudience(), isAdEligibleForCustomer() (+16 more)

### Community 167 - "SettingsPage"
Cohesion: 0.33
Nodes (3): SettingsPage(), patchProfile(), saveFieldEdit()

### Community 168 - "scripts/campaign-worker.ts"
Cohesion: 0.60
Nodes (5): log(), loop(), requestShutdown(), sleep(), runAdLifecycleTick()

### Community 169 - "loyalty-reward-removal.ts"
Cohesion: 0.47
Nodes (4): decideRewardRemoval(), LoyaltyRewardDraft, RewardRemovalDecision, updateDraftRewardsForRemoval()

### Community 170 - "EmployeeLoginScreen"
Cohesion: 0.40
Nodes (3): EmployeeLoginScreen(), onSubmit(), readApiJson()

### Community 172 - "landing-footer.tsx"
Cohesion: 0.67
Nodes (3): COLUMNS, isInternalPath(), LandingFooter()

### Community 173 - "card-template-schema.ts"
Cohesion: 0.09
Nodes (28): LoyaltyWidgetProgress, baseStyle(), NextRewardView(), Props, shellStyle(), NextRewardStylePicker(), CARD_FONT_OPTIONS, CardFontId (+20 more)

### Community 174 - "campaign-quota.test.ts"
Cohesion: 0.47
Nodes (5): campaignQuotaUsageFindUnique, campaignQuotaUsageUpsert, executeRaw, fakeTx(), merchantSubscriptionFindUnique

### Community 175 - "loyalty-cards-capture.mjs"
Cohesion: 0.40
Nodes (3): goto(), OUT, tiers

### Community 176 - "subscriptions-home.tsx"
Cohesion: 0.47
Nodes (4): SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight()

### Community 178 - "avatar-storage.ts"
Cohesion: 0.50
Nodes (4): AVATAR_DIR, MIME_TO_EXT, parseAvatarDataUrl(), saveAvatar()

### Community 179 - "capture-employe-screenshots.mjs"
Cohesion: 0.67
Nodes (3): main(), outDir, shot()

### Community 180 - "landing-header.tsx"
Cohesion: 0.67
Nodes (3): isInternalRoute(), LandingHeader(), NAV_LINKS

## Knowledge Gaps
- **994 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+989 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1345 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `merchants-list.tsx`, `rbac.ts`, `app/ui.tsx`, `sponsored-hours-pricing.ts`, `react`, `merchant-card-template-service.ts`, `firstActiveStaffMembership`, `getSessionUser`, `resolvePublishedMerchantCardTemplate`, `@prisma/client`, `merchant-ad-edit.test.ts`, `campaign-moderation-home.tsx`, `super-admin-campaign-moderation.test.ts`, `requireMutatingRequest`, `wallet-hydration.test.tsx`, `api-merchant-statistics-route.test.ts`, `customer-onboarding.ts`, `cn`, `clients/ui.tsx`, `src/app/layout.tsx`, `layout-shell.tsx`, `google-auth.ts`, `middleware.ts`, `demo-routing.test.ts`, `finalisation/page.tsx`, `http.ts`, `marketing-topup-route.test.ts`, `super-admin-ad-moderation.test.ts`, `caisse-scan-route.test.ts`, `programme/ui.tsx`, `ad-detail.tsx`, `package.json`, `card-editor.tsx`, `qa-login/page.tsx`, `ad-visuals.ts`, `[id]/merchant-detail.tsx`, `preferences/route.ts`, `scan/ui.tsx`, `app/statistiques/page.tsx`, `landing-footer.tsx`, `demo-session.ts`, `src/app/page.tsx`, `subscriptions-home.tsx`, `landing-header.tsx`, `loyaltyBalanceForMode`, `demo/page.tsx`, `resolveMediaFilePath`, `card-enlarged-view.tsx`, `api-guard.ts`, `vitest`, `demo-visual.ts`, `customer-qr-route.test.ts`, `unsubscribe/route.ts`, `jsonError`, `campagnes/ui.tsx`, `wallet-home.tsx`, `profile-page.tsx`, `types.ts`, `notifications-center.tsx`, `campaign-crud-routes.test.ts`, `env.ts`, `ad-confirm-route.test.ts`, `campaign-confirm-route.test.ts`, `sponsored-placements.test.ts`, `cards-index.tsx`?**
  _High betweenness centrality (0.198) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `caisse-scan.ts`, `@prisma/client`, `rbac.ts`, `merchant-card-template-service.ts`, `sponsored-hours-pricing.ts`, `react`, `loyalty-program.ts`, `getSessionUser`, `loyalty-widget.ts`, `card-editor-properties.tsx`, `merchant-billing.ts`, `customer-onboarding.ts`, `src/app/layout.tsx`, `google-auth.ts`, `middleware.ts`, `demo-routing.test.ts`, `customer-reward-progress.ts`, `package.json`, `[id]/merchant-detail.tsx`, `statistiques-panel.tsx`, `fake-ad-db.ts`, `media-storage.ts`, `loyalty-commit.test.ts`, `loyalty-commit.ts`, `loyalty-program-publication.ts`, `super-admin.test.ts`, `qa-login.ts`, `ref_node_path`, `email.ts`, `insight-stats.ts`, `sponsored-slot.test.tsx`, `card-enlarged-view.tsx`, `platform-stats.ts`, `stripe-webhook-marketing.test.ts`, `stripe-webhook-route.test.ts`, `google-wallet/route.ts`, `merchant-card-renderer.tsx`, `qr-input.ts`, `customer-qr-route.test.ts`, `unsubscribe/route.ts`, `ads/[id]/confirm/route.ts`, `stripe.ts`, `qr.ts`, `ad-visual-journeys.test.ts`, `wallet-home.tsx`, `loyalty-service.ts`, `campaign-worker.test.ts`, `campaign-crud-routes.test.ts`, `env.ts`, `ad-confirm-route.test.ts`, `campaign-confirm-route.test.ts`, `sponsored-placements.test.ts`, `webhook/route.ts`, `scan-session.ts`, `prisma.ts`, `super-admin-campaign-moderation.test.ts`, `merchant-ad-edit.test.ts`, `landing-page.test.ts`, `push-client.ts`, `campaign-fixes.test.ts`, `admin-ad-fiche.test.ts`, `wallet-hydration.test.tsx`, `api-merchant-statistics-route.test.ts`, `wallet-unlock.ts`, `campaign-test-mode-isolation.test.ts`, `loyalty-service.test.ts`, `marketing-balance.test.ts`, `caisse-scan.test.ts`, `employee-invitation-service.ts`, `preview-data.ts`, `marketing-topup-route.test.ts`, `super-admin-ad-moderation.test.ts`, `caisse-scan-route.test.ts`, `preferences/route.ts`, `card-deck.tsx`, `loyalty-reward-removal.ts`, `card-template-schema.ts`, `campaign-quota.test.ts`?**
  _High betweenness centrality (0.129) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `@prisma/client` to `webhook/route.ts`, `rbac.ts`, `merchant-card-template-service.ts`, `sponsored-hours-pricing.ts`, `prisma.ts`, `loyalty-program.ts`, `resolvePublishedMerchantCardTemplate`, `loyalty-widget.ts`, `validation.ts`, `card-editor-properties.tsx`, `requireMutatingRequest`, `merchant-billing.ts`, `customer-onboarding.ts`, `wallet-unlock.ts`, `ad-visual-workflow.ts`, `loyalty-service.test.ts`, `layout-shell.tsx`, `preview-data.ts`, `employee-invitation-service.ts`, `google-auth.ts`, `google-wallet.ts`, `lib/campaign-worker.ts`, `customer-reward-progress.ts`, `create-super-admin.ts`, `programme/ui.tsx`, `card-editor.tsx`, `package.json`, `preferences/route.ts`, `staff-permissions.ts`, `sponsored-selection.ts`, `loyalty-reward-removal.ts`, `loyalty-commit.ts`, `loyalty-program-publication.ts`, `super-admin.test.ts`, `qa-login.ts`, `loyaltyBalanceForMode`, `insight-stats.ts`, `api-guard.ts`, `platform-stats.ts`, `merchant-card-renderer.tsx`, `ads/[id]/confirm/route.ts`, `next`, `qr.ts`, `jsonError`, `wallet-home.tsx`, `loyalty-service.ts`, `types.ts`, `requireSuperAdmin`, `env.ts`, `cards-index.tsx`, `cashier-checkout.tsx`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _994 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `caisse-scan.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1396011396011396 - nodes in this community are weakly interconnected._
- **Should `@prisma/client` be split into smaller, more focused modules?**
  _Cohesion score 0.13107822410147993 - nodes in this community are weakly interconnected._
- **Should `rbac.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12096774193548387 - nodes in this community are weakly interconnected._