# Graph Report - Cartefidelité  (2026-10-03)

## Corpus Check
- 717 files · ~4,806,553 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: (none) 6, .example 4, .css 4)

## Summary
- 3997 nodes · 12474 edges · 193 communities (161 shown, 32 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 48 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `229235ec`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- caisse-scan.ts
- loyalty-context.ts
- rbac.ts
- merchant-card-template-service.ts
- click/route.ts
- react
- loyalty-commit.ts
- SettingsPanel
- google-wallet/route.ts
- loyalty-widget-view.tsx
- loyalty-widget.ts
- validation.ts
- VisualPicker
- card-editor-properties.tsx
- jsonOk
- buildGoogleWalletMerchantView
- merchant-billing.ts
- session.ts
- merchants-list.tsx
- ads/[id]/confirm/route.ts
- clients/ui.tsx
- prisma.ts
- cashier-checkout.tsx
- google-wallet.ts
- google-auth.ts
- middleware.ts
- requireSuperAdmin
- clientIp
- fiche.tsx
- demo-routing.test.ts
- customer-reward-progress.ts
- create-super-admin.ts
- programme/ui.tsx
- card-editor.tsx
- package.json
- [id]/merchant-detail.tsx
- statistiques-panel.tsx
- ad-visuals.ts
- customer-onboarding.ts
- What You Must Do When Invoked
- scan/ui.tsx
- media-storage.ts
- loyalty-commit.test.ts
- CardEditorBackgroundCrop
- loyalty-service.ts
- demo-session.ts
- src/app/page.tsx
- compilerOptions
- wallet-event-dedup.ts
- @prisma/client
- super-admin.test.ts
- qa-login.ts
- ref_node_path
- dependencies
- loyaltyBalanceForMode
- email.ts
- devDependencies
- insight-stats.ts
- sponsored-slot.test.tsx
- sponsored-test-broadcast.ts
- wallet-home.tsx
- employee-session.ts
- scripts
- facturation/ui.tsx
- platform-stats.ts
- demo-mode.ts
- card-deck.tsx
- vitest
- webhook/route.ts
- stripe-webhook-route.test.ts
- fake-ad-db.ts
- demo-visual.ts
- merchant-card-renderer.tsx
- AdvantagesEditor
- reward-form-dialog.tsx
- qr-cache.ts
- lib/campaign-worker.ts
- marketing-topup-route.test.ts
- campaign-quota.ts
- stripe.ts
- super-admin-session.ts
- cartes.js
- Fideto
- docker-entrypoint.sh
- merchant-cards-gallery.tsx
- firstActiveStaffMembership
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
- customer-loyalty-overview.ts
- MerchantCampaignFiche
- src/app/layout.tsx
- cn
- generate-pwa-icons.mjs
- graphify reference: query, path, explain
- campaign-worker.test.ts
- layout-shell.tsx
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
- use-wallet-unlock-animation.ts
- campaign-confirm-route.test.ts
- sponsored-placements.test.ts
- tarifs/page.tsx
- customer-layout-guard.ts
- HourlySchedulePicker
- marketing-balance.test.ts
- solde/ui.tsx
- employes/ui.tsx
- app/ui.tsx
- employees/[id]/route.ts
- super-admin-campaign-moderation.test.ts
- MerchantDetailPage
- merchant-ad-edit.test.ts
- landing-page.test.ts
- customer-preferences-route.test.ts
- customer-qr.ts
- push-client.ts
- campaign-moderation-home.tsx
- campaign-fixes.test.ts
- admin-ad-fiche.test.ts
- EmployeeDetailPanel
- google-wallet-media-route.test.ts
- fife-life/merchant-detail.tsx
- campaign-test-mode-isolation.test.ts
- loyalty-service.test.ts
- google-wallet-doctor.ts
- types.ts
- employee-invitation-service.ts
- profile-page.tsx
- stripe-webhook-marketing.test.ts
- super-admin-ad-moderation.test.ts
- sponsored-slot.tsx
- finalisation/page.tsx
- campaign-audience.ts
- AdDetailPage
- push.ts
- customer-push-route.test.ts
- ad-detail.tsx
- caisse-scan.test.ts
- qr.ts
- sponsored-hours-pricing.ts
- qa-login/page.tsx
- cards-index.tsx
- sponsored-selection.ts
- api-merchant-statistics-route.test.ts
- CampagnesPanel
- next
- sponsored-test-broadcast.test.ts
- app/statistiques/page.tsx
- caisse-scan-route.test.ts
- card-template-schema.ts
- campaign-quota.test.ts
- resolveMediaFilePath
- EmployeeLoginScreen
- capture-employe-screenshots.mjs
- trim-card-images.mjs
- use-media-query.ts
- avatar-storage.ts
- super-admin-ad-detail-page.test.ts
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
1. `jsonError()` - 261 edges
2. `jsonOk()` - 227 edges
3. `requireMutatingRequest()` - 163 edges
4. `next` - 161 edges
5. `prisma` - 148 edges
6. `vitest` - 123 edges
7. `clientIp()` - 119 edges
8. `readJson()` - 114 edges
9. `react` - 111 edges
10. `userAgent()` - 108 edges

## Surprising Connections (you probably didn't know these)
- `loop()` --calls--> `runWorkerTick()`  [EXTRACTED]
  scripts/campaign-worker.ts → src/lib/campaign-worker.ts
- `main()` --calls--> `getActiveStripeMode()`  [EXTRACTED]
  scripts/diagnose-ads.ts → src/lib/stripe-mode.ts
- `main()` --calls--> `isPaymentAllowedForMerchant()`  [EXTRACTED]
  scripts/diagnose-ads.ts → src/lib/stripe-mode.ts
- `main()` --calls--> `getActiveMerchantLoyaltyContext()`  [EXTRACTED]
  scripts/diagnose-loyalty-program.ts → src/lib/loyalty-context.ts
- `approvedAd()` --calls--> `PATCH()`  [EXTRACTED]
  tests/campaign-fixes.test.ts → src/app/api/merchant/ads/[id]/route.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (193 total, 32 thin omitted)

### Community 0 - "caisse-scan.ts"
Cohesion: 0.19
Nodes (15): buildScanResult(), CaisseScanError, maskClientNumberForLog(), findUserByCustomerNumber(), processCaisseScan(), processCaisseScanByClientNumber(), deriveClientNumber(), formatClientNumberDisplay() (+7 more)

### Community 1 - "loyalty-context.ts"
Cohesion: 0.11
Nodes (34): formatAddress(), MerchantProfile(), join(), MerchantProfileData, safeExternalUrl(), buildProgramSnapshot(), buildProgramSnapshotFromContext(), CaisseProgramSnapshot (+26 more)

### Community 2 - "rbac.ts"
Cohesion: 0.12
Nodes (24): CaissePage(), DashboardLayout(), hasMerchantStaffAccess(), isMerchantAppPublicPath(), MERCHANT_APP_PUBLIC_PATHS, resolveMerchantAppAccess(), shouldRedirectAppToEmployeeSpace(), assertCanAddEmployee() (+16 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.08
Nodes (48): GET(), LOYALTY_MODES, GET(), JoinMerchantPage(), getPublishedCardTemplate(), cardSlotForLoyaltyMode(), isLoyaltyProgramSlot(), loyaltyModeForCardSlot() (+40 more)

### Community 4 - "click/route.ts"
Cohesion: 0.18
Nodes (12): log(), loop(), requestShutdown(), sleep(), GET(), computeAdLifecycleStatus(), runAdLifecycleTick(), isSafeAdUrl() (+4 more)

### Community 5 - "react"
Cohesion: 0.09
Nodes (27): react, Merchant, MerchantPublic(), CustomerLoginForm(), googleMessage(), recoverMessage(), EmployeeInvitationScreen(), FormState (+19 more)

### Community 6 - "loyalty-commit.ts"
Cohesion: 0.08
Nodes (49): appliedTierLabel(), assembleView(), buildView(), commitLoyaltyTransaction(), customerName(), isMerchantActive(), isProgramActive(), loadEarnHistory() (+41 more)

### Community 8 - "google-wallet/route.ts"
Cohesion: 0.15
Nodes (23): ensureWalletClassRecord(), parseWalletAction(), POST(), publishedMediaExists(), schema, validateAppearanceColor(), contrastWithWhite(), GOOGLE_WALLET_RECOMMENDED_COLORS (+15 more)

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.07
Nodes (35): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetProgress, LoyaltyWidgetView(), pct(), ProgressCircle() (+27 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.09
Nodes (36): LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), EditorValidationIssue, EditorValidationSummary, missingWidgetLabel(), publishValidationResult(), PublishValidationResult, applyStyleVariantPreservingColors() (+28 more)

### Community 11 - "validation.ts"
Cohesion: 0.06
Nodes (39): POST(), schema, POST(), requireStandardUser(), isCustomerProfileComplete(), markCustomerProfileFinalized(), acceptInvitationSchema, adjustmentSchema (+31 more)

### Community 12 - "VisualPicker"
Cohesion: 0.19
Nodes (13): deleteCampaignMediaUrl(), loadImageElement(), readFileAsDataUrl(), SelfVisualCropper(), uploadCampaignMedia(), VisualPicker(), dropSelfFiles(), onCropConfirm() (+5 more)

### Community 13 - "card-editor-properties.tsx"
Cohesion: 0.07
Nodes (63): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, elementLabel(), GuideLine (+55 more)

### Community 14 - "jsonOk"
Cohesion: 0.12
Nodes (47): POST(), POST(), POST(), POST(), POST(), POST(), DELETE(), POST() (+39 more)

### Community 15 - "buildGoogleWalletMerchantView"
Cohesion: 0.28
Nodes (16): appLinkData(), availableRewardModules(), buildGoogleWalletMerchantView(), cardUrl(), classTemplateInfo(), globalClassPatchBody(), globalObjectBody(), imageData() (+8 more)

### Community 16 - "merchant-billing.ts"
Cohesion: 0.10
Nodes (32): GET(), attachReceipts(), BillingError, CANCELLABLE, CancellationPreview, effectiveEndDate(), InvoicesResult, listMerchantInvoices() (+24 more)

### Community 17 - "session.ts"
Cohesion: 0.19
Nodes (16): POST(), GET(), GET(), POST(), DELETE(), GET(), parseUserAgent(), deleteAvatarFiles() (+8 more)

### Community 18 - "merchants-list.tsx"
Cohesion: 0.18
Nodes (12): formatActivity(), MerchantRow, MerchantsListPage(), modeLabel(), pickPreviewTemplate(), statusLabel(), ACTION_DESCRIPTION, ACTION_LABEL (+4 more)

### Community 19 - "ads/[id]/confirm/route.ts"
Cohesion: 0.08
Nodes (37): billingCustomer(), InsufficientBalance, pendingCheckout(), POST(), QuotaExhausted, GET(), GET(), GET() (+29 more)

### Community 20 - "clients/ui.tsx"
Cohesion: 0.13
Nodes (17): CustomerDetailPage(), ClientsPage(), Customer, CustomerDetail, CustomerDetailPanel(), CustomerInsight, CustomersPanel(), CustomerStats (+9 more)

### Community 21 - "prisma.ts"
Cohesion: 0.09
Nodes (31): FILTER_MAP, schema, dynamic, GET(), GET(), GET(), GET(), sortOrder() (+23 more)

### Community 22 - "cashier-checkout.tsx"
Cohesion: 0.14
Nodes (24): AmountField(), press(), KEYS, CashierCheckout(), askRedeem(), commitEarn(), confirmRedeem(), Phase (+16 more)

### Community 23 - "google-wallet.ts"
Cohesion: 0.15
Nodes (35): isGoogleWalletConfigured(), accessToken(), assertConfigured(), buildGoogleWalletIds(), classProfileForMode(), createGlobalGoogleWalletSaveUrl(), createMerchantGoogleWalletSaveUrl(), customerQrValue() (+27 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.11
Nodes (29): GET(), GET(), CustomerLoginPage(), CustomerSignupPage(), CustomerSignupForm(), isGoogleAuthConfigured(), consumeGoogleCallback(), createGoogleAuthUrl() (+21 more)

### Community 25 - "middleware.ts"
Cohesion: 0.14
Nodes (23): hostMatches(), hostnameOf(), isAdminHost(), isAppHost(), isCustomerHost(), isEmployeeHost(), isLocalHost(), legacyRedirectOrigin() (+15 more)

### Community 26 - "requireSuperAdmin"
Cohesion: 0.09
Nodes (32): GET(), GET(), GET(), GET(), POST(), GET(), GET(), PERIODS (+24 more)

### Community 27 - "clientIp"
Cohesion: 0.10
Nodes (51): POST(), POST(), schema, logScanBody(), POST(), scanVia(), POST(), GET() (+43 more)

### Community 28 - "fiche.tsx"
Cohesion: 0.10
Nodes (22): AdStatus, Detail, euros(), HistoryRow, PaymentPreview, PayMethod, STATUS_LABELS, block (+14 more)

### Community 30 - "customer-reward-progress.ts"
Cohesion: 0.11
Nodes (31): MerchantRewardProgressPanel(), TargetBlock(), buildTargetView(), getCustomerMerchantRewardProgress(), resolveVisualState(), CustomerMerchantRewardProgress, MerchantRewardProgressTarget, REWARD_ALMOST_THRESHOLD_PERCENT (+23 more)

### Community 31 - "create-super-admin.ts"
Cohesion: 0.50
Nodes (4): bcryptjs, main(), prisma, required()

### Community 32 - "programme/ui.tsx"
Cohesion: 0.17
Nodes (13): DEMO_CONFIG, MODES, modeTitle(), PROGRAM_STEPS, ProgramConfigurator(), goToStep(), isCurrentReward(), primaryFooterAction() (+5 more)

### Community 33 - "card-editor.tsx"
Cohesion: 0.08
Nodes (45): buildElementCatalog(), CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction() (+37 more)

### Community 34 - "package.json"
Cohesion: 0.08
Nodes (24): description, engines, node, name, prisma, seed, private, version (+16 more)

### Community 35 - "[id]/merchant-detail.tsx"
Cohesion: 0.16
Nodes (18): MEDIA_TO_APPEARANCE_KEY, RECOMMENDED_WALLET_COLORS, WalletAppearance, WalletMediaKey, WalletMediaPreview, WalletPreviewView, GoogleWalletMediaCrop(), confirm() (+10 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.09
Nodes (32): ApiResponse, COMPARISON_METRICS, FideliteTab(), FinancesTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder (+24 more)

### Community 37 - "ad-visuals.ts"
Cohesion: 0.09
Nodes (45): GET(), EDITABLE_STATUSES, PATCH(), POST(), POST(), schema, DELETE(), uploadSchema (+37 more)

### Community 38 - "customer-onboarding.ts"
Cohesion: 0.13
Nodes (24): createRawCustomerToken(), CUSTOMER_TOKEN_TTL, invalidateCustomerAccessTokens(), issueCustomerAccessToken(), beginCustomerOnboarding(), buildAccountRecoveryUrl(), buildEmailVerificationUrl(), CustomerAccessLevel (+16 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "scan/ui.tsx"
Cohesion: 0.07
Nodes (51): ADMIN_PERMISSIONS, CaisseScreen(), ScanResult, EmployeeProfile, EmployeeScanScreen(), Phase, ScanResult, statusLabel() (+43 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.12
Nodes (28): GET(), notFound(), appearanceKeyForGoogleWalletMedia(), assertExactDimensions(), deleteCampaignMedia(), deleteCardBackground(), getUploadsRoot(), GoogleWalletMediaKind (+20 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 44 - "loyalty-service.ts"
Cohesion: 0.26
Nodes (13): assertEarnProgramRules(), updateWalletBalance(), applyAdjustment(), applyEarnVisit(), applyRedeemReward(), computeLoyalty(), LoyaltyError, LoyaltySnapshot (+5 more)

### Community 45 - "demo-session.ts"
Cohesion: 0.16
Nodes (17): GET(), GET(), GET(), GET(), GET(), demoCookieNamesForRole(), demoEnterTarget(), DemoRole (+9 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.07
Nodes (39): next-themes, BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, MERCHANT_BENEFITS, metadata, PROOF_ITEMS, ArrowRightIcon() (+31 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "wallet-event-dedup.ts"
Cohesion: 0.18
Nodes (20): useWalletEvents(), connect(), disconnect(), onVisibility(), canUseSessionStorage(), getStoredLastEventId(), hasAnimatedCard(), hasSeenWalletEvent() (+12 more)

### Community 49 - "@prisma/client"
Cohesion: 0.10
Nodes (35): @prisma/client, GET(), loadProgram(), POST(), dynamic, MerchantProfilePage(), balanceFieldForUnit(), setActiveBalanceData() (+27 more)

### Community 50 - "super-admin.test.ts"
Cohesion: 0.17
Nodes (16): BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr(), sumCollectedRevenue() (+8 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.10
Nodes (31): ref_crypto, assertNoUnknownArgs(), main(), parseTtlMinutes(), assertQaLoginTtlMinutes(), auditQaLogin(), configuredSubjectId(), createQaMagicLoginToken() (+23 more)

### Community 52 - "ref_node_path"
Cohesion: 0.04
Nodes (36): ref_node_fs, ref_node_path, ref_node_url, playwright, outDir, pages, OUT, OUT (+28 more)

### Community 53 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+11 more)

### Community 54 - "loyaltyBalanceForMode"
Cohesion: 0.18
Nodes (18): main(), dynamic, GET(), CarteIndexPage(), dynamic, CardPage(), dynamic, demoWalletProps() (+10 more)

### Community 55 - "email.ts"
Cohesion: 0.17
Nodes (26): nodemailer, ContactPage(), buildCampaignEmailContent(), buildCustomerFinalizationContent(), buildInvitationContent(), CampaignEmailInput, CustomerFinalizationEmailInput, emailConfigHint() (+18 more)

### Community 56 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, eslint-config-next, happy-dom, playwright, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+8 more)

### Community 57 - "insight-stats.ts"
Cohesion: 0.08
Nodes (57): addParisDays(), addParisMonths(), bucketKey(), enumerateBucketKeys(), enumerateDayKeys(), enumerateMonthKeys(), enumerateWeekKeys(), InsightBucket (+49 more)

### Community 58 - "sponsored-slot.test.tsx"
Cohesion: 0.11
Nodes (10): MobilePlacementPreview(), resetSponsoredSessionState(), AD, calls, FakeIntersectionObserver, flush(), mount(), Observer (+2 more)

### Community 59 - "sponsored-test-broadcast.ts"
Cohesion: 0.17
Nodes (23): buildGlobalWalletValueAddedModule(), globalWalletCampaignDetailUri(), GlobalWalletCampaignModule, localized(), publicCampaignImageUrl(), walletHttpsUri(), publicGoogleWalletError(), selectSponsoredForGoogleWalletGlobal() (+15 more)

### Community 60 - "wallet-home.tsx"
Cohesion: 0.11
Nodes (23): motion, react-dom, CardEnlargedView(), CardEnlargedViewProps, isFifeLifeCard(), CardsSheet(), ExpandableQrCode(), handleActivate() (+15 more)

### Community 61 - "employee-session.ts"
Cohesion: 0.19
Nodes (17): EmployeeLoginPage(), ProEntryPage(), canEmployeeAccess(), cookieOptions(), createEmployeeSession(), destroyEmployeeSession(), employeeCookieName(), employeeFromToken() (+9 more)

### Community 62 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:migrate, db:migrate:dev, db:seed, db:studio, dev, icons (+6 more)

### Community 63 - "facturation/ui.tsx"
Cohesion: 0.19
Nodes (14): api(), BillingPanel(), confirmCancellation(), openPortal(), startCancellation(), Cancellation, day(), Invoice (+6 more)

### Community 64 - "platform-stats.ts"
Cohesion: 0.29
Nodes (12): GET(), dateKey(), fillDailySeries(), getPlatformAlerts(), getPlatformOverview(), getPlatformRecentActivity(), getPlatformTimeSeries(), getSponsoredAdsStats() (+4 more)

### Community 65 - "demo-mode.ts"
Cohesion: 0.18
Nodes (14): CaisseAliasPage(), EmployeeHomePage(), EmployeeScanPage(), EMPLOYEE_DEMO_COOKIE, isClientDemoMode(), isDemoCookie(), isPublicDemoEnabled(), MERCHANT_DEMO_COOKIE (+6 more)

### Community 66 - "card-deck.tsx"
Cohesion: 0.07
Nodes (41): activeCardFromDeck(), CardDeck(), handleCardExpand(), handleDragEnd(), handleKeyDown(), snapTo(), DeckItem, demoStartIndex() (+33 more)

### Community 67 - "vitest"
Cohesion: 0.07
Nodes (21): ref_fs, ref_path, vitest, main(), outDir, shot(), outDir, OUT (+13 more)

### Community 68 - "webhook/route.ts"
Cohesion: 0.21
Nodes (16): handleChargeRefunded(), handleCheckoutSessionCompleted(), handleCheckoutSessionExpired(), handlePaymentIntentFailed(), handleStripeEvent(), paymentIntentIdOf(), POST(), isCancellable() (+8 more)

### Community 69 - "stripe-webhook-route.test.ts"
Cohesion: 0.11
Nodes (15): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindFirst, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent (+7 more)

### Community 70 - "fake-ad-db.ts"
Cohesion: 0.13
Nodes (18): END, fake, h, previewCall(), START, END, fake, START (+10 more)

### Community 71 - "demo-visual.ts"
Cohesion: 0.10
Nodes (24): CarteIdentitePage(), AccountPage(), ParametresPage(), dynamic, NotificationsPage(), PREVIEW_BENEFITS, PREVIEW_HISTORY, PREVIEW_PREFERENCES (+16 more)

### Community 72 - "merchant-card-renderer.tsx"
Cohesion: 0.11
Nodes (34): LoyaltyWidgetProgressInput, COMPACT_HIDDEN, displayClientName(), elementShellStyle(), ElementView(), MerchantCardDisplayMode, MerchantCardRenderer(), MerchantCardRendererProps (+26 more)

### Community 73 - "AdvantagesEditor"
Cohesion: 0.26
Nodes (16): AdvantagesEditor(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward(), openEditReward() (+8 more)

### Community 74 - "reward-form-dialog.tsx"
Cohesion: 0.20
Nodes (12): emptyReward(), FieldErrors, previewLine(), REWARD_TYPES, RewardFormDialog(), handleSubmit(), RewardTypeIcon(), rewardTypeLabel() (+4 more)

### Community 75 - "qr-cache.ts"
Cohesion: 0.12
Nodes (21): MerchantInteractiveCard(), MerchantInteractiveCardProps, PREVIEW_CARDS, PREVIEW_QR, QrBlock(), cache, cacheKey(), failedOnce (+13 more)

### Community 76 - "lib/campaign-worker.ts"
Cohesion: 0.14
Nodes (21): jose, backoffMinutesForAttempt(), claimNextScheduledCampaign(), deliveryChannelsFor(), finalizeCampaignIfComplete(), materializeDeliveries(), processPendingDeliveries(), runWorkerTick() (+13 more)

### Community 77 - "marketing-topup-route.test.ts"
Cohesion: 0.20
Nodes (8): createMarketingTopupCheckoutSession, FakeStripeNotConfiguredError, ledgerCreate, ledgerUpdate, requireMerchantAdmin, requireMutatingRequest, stripeMode, writeAudit

### Community 78 - "campaign-quota.ts"
Cohesion: 0.17
Nodes (21): computeAdPricing(), GET(), GET(), consumeQuotaForCampaign(), planAndRemainingQuota(), priceMemberOrNetworkCampaign(), priceSponsoredAd(), PricingResult (+13 more)

### Community 79 - "stripe.ts"
Cohesion: 0.09
Nodes (40): stripe, GET(), GET(), POST(), topupSchema, getMarketingBalanceCents(), isValidTopupAmountCents(), MAX_TOPUP_CENTS (+32 more)

### Community 80 - "super-admin-session.ts"
Cohesion: 0.08
Nodes (31): SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight(), AuditPage(), SuperAdminAuditPage(), Check, DiagnosticPage() (+23 more)

### Community 81 - "cartes.js"
Cohesion: 0.53
Nodes (5): getViewModel(), mount(), update(), nonNegativeNumber(), safeImageUrl()

### Community 82 - "Fideto"
Cohesion: 0.13
Nodes (14): Checklist de déploiement, Configuration Google Wallet, Création des sous-domaines DNS, Déploiement d’une mise à jour, Déploiement initial, Déploiement VPS sans Docker local, Fideto, Installation locale (sans Docker) (+6 more)

### Community 83 - "docker-entrypoint.sh"
Cohesion: 0.70
Nodes (4): fail(), is_placeholder_secret(), docker-entrypoint.sh script, validate_production_secrets()

### Community 84 - "merchant-cards-gallery.tsx"
Cohesion: 0.12
Nodes (21): LegacyCardEditorRedirect(), CardEditorVariantRoute(), MerchantCardsGallery(), slotStatusLabel(), slotTone(), statusBadgeClass(), ALL_MERCHANT_CARD_SLOTS, CARD_SLOT_SLUGS (+13 more)

### Community 85 - "firstActiveStaffMembership"
Cohesion: 0.17
Nodes (24): CampagneFichePage(), CampagnesPage(), SoldeMarketingPage(), EmployeeDetailPage(), EmployeesPage(), FidelisationPage(), FidelisationPanel(), FacturationPage() (+16 more)

### Community 86 - "ad-visual-journeys.test.ts"
Cohesion: 0.13
Nodes (16): submit(), adminPropose(), createAd(), ctx(), dataUrl(), fake, fetchFile(), h (+8 more)

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "jsonError"
Cohesion: 0.07
Nodes (53): GET(), PATCH(), GET(), POST(), GET(), DELETE(), POST(), GET() (+45 more)

### Community 93 - "campagnes/ui.tsx"
Cohesion: 0.06
Nodes (21): AD_STATUS_LABELS, AdRequest, AdStatus, Audience, AUDIENCE_LABELS, CampaignSummary, Channel, CHANNEL_LABELS (+13 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "customer-loyalty-overview.ts"
Cohesion: 0.14
Nodes (24): WalletHome(), activityFromWalletEvent(), buildCardNextRewardEntry(), buildFifeLifeNextReward(), buildHistoricalRewardOverview(), buildNextRewardCandidates(), CardNextRewardEntry, CardRewardProgress (+16 more)

### Community 102 - "MerchantCampaignFiche"
Cohesion: 0.35
Nodes (10): api(), MerchantCampaignFiche(), addSources(), onFile(), onFramed(), post(), onFileChosen(), isExactBanner() (+2 more)

### Community 103 - "src/app/layout.tsx"
Cohesion: 0.15
Nodes (8): src_app_globals, dynamic, manrope, metadata, viewport, PwaRegister(), THEME_COLOR, ThemeProvider()

### Community 104 - "cn"
Cohesion: 0.15
Nodes (13): DashboardLayout(), CreateMerchantWizard(), goNext(), stepError(), AppNav(), icons, isActive(), TOOLS_PREFIXES (+5 more)

### Community 105 - "generate-pwa-icons.mjs"
Cohesion: 0.28
Nodes (8): ref_node_buffer, ref_node_zlib, chunk(), color, crc32(), outDir, png(), root

### Community 106 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 107 - "campaign-worker.test.ts"
Cohesion: 0.12
Nodes (15): baseCampaign, campaignDeliveryCount, campaignDeliveryCreateMany, campaignDeliveryFindMany, campaignDeliveryUpdate, campaignUpdate, customerMembershipFindMany, customerPreferencesFindMany (+7 more)

### Community 108 - "layout-shell.tsx"
Cohesion: 0.10
Nodes (16): recharts, ACTIVITY_LABELS, DashboardHome(), formatEuros(), Overview, QUICK_LINKS, SuperAdminStatsPage(), StatisticsPage() (+8 more)

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
Cohesion: 0.24
Nodes (8): DEMO_NOTIFICATIONS, kindLabel(), NotificationItem, NotificationKind, NotificationMerchant, NotificationsCenter(), markOneRead(), openNotification()

### Community 118 - "campaign-crud-routes.test.ts"
Cohesion: 0.20
Nodes (8): campaignCreate, campaignFindFirst, campaignFindMany, campaignUpdate, refundCampaignDebit, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 120 - "env.ts"
Cohesion: 0.10
Nodes (14): dynamic, robots(), dynamic, sitemap(), assertSameOrigin(), CsrfError, employeeCookieName(), employeeTokenFromRequest() (+6 more)

### Community 121 - "ad-confirm-route.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindFirst, adRequestUpdate, adRequestUpdateMany, campaignUpdate, createCampaignCheckoutSession, executeRaw, FakeStripeNotConfiguredError, getQuotaUsage (+5 more)

### Community 122 - "use-wallet-unlock-animation.ts"
Cohesion: 0.15
Nodes (22): dynamic, GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), runtime, sseChunk(), isDocumentVisible() (+14 more)

### Community 123 - "campaign-confirm-route.test.ts"
Cohesion: 0.12
Nodes (17): baseCampaign, campaignFindFirst, campaignUpdate, campaignUpdateMany, debitForCampaign, estimateMerchantMembersAudience, estimateNetworkLocalAudience, getMarketingBalanceCents (+9 more)

### Community 124 - "sponsored-placements.test.ts"
Cohesion: 0.18
Nodes (14): GET(), previewResponse(), loadAdPreviewCard(), parsePlacement(), selectSponsoredForCustomer(), click(), END, fake (+6 more)

### Community 125 - "tarifs/page.tsx"
Cohesion: 0.13
Nodes (16): AppLoginPage(), HomePage(), FIDETO_MONTHLY, metadata, PACK_SETUP, TarifsPage(), PricingFaq(), QUESTIONS (+8 more)

### Community 126 - "customer-layout-guard.ts"
Cohesion: 0.38
Nodes (6): CarteLayout(), CompteLayout(), NotificationsLayout(), enforceCustomerWalletAccess(), customerWalletGuardRedirect(), runCustomerOnboardingSideEffects()

### Community 127 - "HourlySchedulePicker"
Cohesion: 0.22
Nodes (14): addDaysToDateInput(), defaultSlotFor(), firstSelectableDate(), HourlySchedulePicker(), addDay(), hoursToSlots(), scheduleDayError(), slotsToHours() (+6 more)

### Community 128 - "marketing-balance.test.ts"
Cohesion: 0.31
Nodes (7): Entry, makeTx(), Mode, snapshot(), state, transaction(), uniqueViolation()

### Community 129 - "solde/ui.tsx"
Cohesion: 0.15
Nodes (16): historyDateKey(), HistoryFilter, matchesFilter(), SoldeMarketingPanel(), topup(), BalanceData, DEMO_BALANCE, estimateSponsorPricing() (+8 more)

### Community 130 - "employes/ui.tsx"
Cohesion: 0.12
Nodes (17): DEMO, Employee, EmployeesPanel(), formatActivity(), statusBadgeLabel(), statusTone(), DEMO_CONFIG, HistoricalEntitlement (+9 more)

### Community 131 - "app/ui.tsx"
Cohesion: 0.18
Nodes (6): HomeStats, KPI_ICONS, MerchantHome(), QUICK_ACTIONS, StatsPreview, TrendMetric

### Community 132 - "employees/[id]/route.ts"
Cohesion: 0.12
Nodes (28): zod, POST(), schema, GET(), POST(), DELETE(), GET(), mapEmployee() (+20 more)

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

### Community 137 - "customer-preferences-route.test.ts"
Cohesion: 0.22
Nodes (7): basePrefs, consentEventCreateMany, customerPreferencesCreate, customerPreferencesFindUnique, customerPreferencesUpdate, requireMutatingRequest, requireUser

### Community 138 - "customer-qr.ts"
Cohesion: 0.46
Nodes (7): qrcode, ensureCustomerMembershipForSlug(), ensureCustomerQrToken(), generateCustomerQrDataUrl(), isUniqueViolation(), logCustomerQr(), tryEnsureCustomerMembershipForSlug()

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
Cohesion: 0.21
Nodes (9): adminStage(), createAd(), ctx(), fake, h, jsonReq(), merchantStage(), moderate() (+1 more)

### Community 143 - "EmployeeDetailPanel"
Cohesion: 0.29
Nodes (6): EmployeeDetailPanel(), patchEmployee(), reactivate(), resendInvite(), saveProfile(), suspend()

### Community 145 - "fife-life/merchant-detail.tsx"
Cohesion: 0.15
Nodes (12): AddToGoogleWalletButton(), CustomerProgramView, DETAIL_TABS, DetailTabId, EMPTY_RECENT_ACTIVITY, MerchantCardDetail(), fallbackCopyLink(), shareCard() (+4 more)

### Community 146 - "campaign-test-mode-isolation.test.ts"
Cohesion: 0.13
Nodes (14): adEventCreate, adRequestFindMany, adRequestFindUnique, campaignDeliveryCreateMany, campaignUpdate, customerMembershipFindMany, customerPreferencesFindMany, inAppNotificationCreate (+6 more)

### Community 147 - "loyalty-service.test.ts"
Cohesion: 0.14
Nodes (13): activeProgram, baseMembership, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeLedgerCreate, loyaltyProgramFindUnique (+5 more)

### Community 148 - "google-wallet-doctor.ts"
Cohesion: 0.39
Nodes (8): google-auth-library, accessToken(), fail(), main(), ok(), pngSize(), googleWalletLogoUrl(), publicUrl()

### Community 149 - "types.ts"
Cohesion: 0.21
Nodes (7): LinearGauge(), MerchantCardPublicPreview(), MerchantFace(), MerchantRoulette(), MerchantCardData, PublicMerchant, ScanResultCardPayload

### Community 150 - "employee-invitation-service.ts"
Cohesion: 0.18
Nodes (18): GET(), POST(), buildInvitationLink(), createInvitationToken(), hashInvitationToken(), INVITATION_ERROR, invitationExpiryDate(), isInvitationExpired() (+10 more)

### Community 151 - "profile-page.tsx"
Cohesion: 0.08
Nodes (36): AvatarFileInput(), AvatarPreviewEditor(), cropCircleToDataUrl(), loadImage(), useAvatarEditor(), GlassBottomSheet(), SheetAction(), HistoryFilter (+28 more)

### Community 152 - "stripe-webhook-marketing.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent, creditTopup (+5 more)

### Community 153 - "super-admin-ad-moderation.test.ts"
Cohesion: 0.22
Nodes (6): adRequestFindUnique, adRequestUpdate, campaignUpdate, requireMutatingRequest, requireSuperAdmin, writeAudit

### Community 154 - "sponsored-slot.tsx"
Cohesion: 0.20
Nodes (9): DiscoverPage(), Merchant, SponsoredAd, getDismissedAds(), rememberDismissed(), reportedThisSession, SponsoredPlacement, SponsoredSlot() (+1 more)

### Community 155 - "finalisation/page.tsx"
Cohesion: 0.26
Nodes (7): FinalisationPage(), FinalisationForm(), resolveCustomerAccessLevel(), isSmsConfigured(), sendSms(), smsConfigHint(), SmsSendResult

### Community 156 - "campaign-audience.ts"
Cohesion: 0.27
Nodes (7): AudienceEstimate, estimatedForChannel(), estimateMerchantMembersAudience(), estimateNetworkLocalAudience(), networkAudienceWhere(), customerMembershipFindMany, customerPreferencesFindMany

### Community 157 - "AdDetailPage"
Cohesion: 0.22
Nodes (14): AdDetailPage(), confirmReason(), patch(), requestSend(), run(), sendProposal(), startTestBroadcast(), stopTestBroadcast() (+6 more)

### Community 158 - "push.ts"
Cohesion: 0.31
Nodes (7): web-push, isWebPushConfigured(), ensureConfigured(), PushPayload, PushSendResult, sendPushToSubscription(), WebPushNotConfiguredError

### Community 159 - "customer-push-route.test.ts"
Cohesion: 0.33
Nodes (4): pushSubscriptionDeleteMany, pushSubscriptionUpsert, requireMutatingRequest, requireUser

### Community 160 - "ad-detail.tsx"
Cohesion: 0.11
Nodes (17): AdRequestDetail, AdStatus, AUDIT_LABELS, AuditRow, Delivery, Draft, Journey, PLACEMENT_LABELS (+9 more)

### Community 161 - "caisse-scan.test.ts"
Cohesion: 0.13
Nodes (14): caisseGrantCreate, customerMembershipCreate, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeQrTokenFindUnique, fifeLifeQrTokenUpdate (+6 more)

### Community 162 - "qr.ts"
Cohesion: 0.26
Nodes (10): main(), prisma, requiredEnv(), upsertEmployee(), assertQrUsable(), QrError, QrPayload, secretKey() (+2 more)

### Community 163 - "sponsored-hours-pricing.ts"
Cohesion: 0.18
Nodes (11): slotAmountCents(), elapsedHoursCount(), MAX_SPONSORED_DAYS, MIN_HOURS_PER_DAY, MIN_SPONSORED_DAYS, parisSlotEnd(), rateForParisHour(), SPONSORED_HOUR_RATE_CENTS (+3 more)

### Community 164 - "qa-login/page.tsx"
Cohesion: 0.36
Nodes (5): dynamic, QaLoginPage(), QaLoginClient(), readFragmentToken(), isQaMagicLoginEnabled()

### Community 165 - "cards-index.tsx"
Cohesion: 0.31
Nodes (9): ALL_SLOTS, cardCounts(), CardsIndexPage(), hasPublishedActiveSlot(), MerchantCardRow, modeLabel(), pickCurrentTemplate(), statusLabel() (+1 more)

### Community 166 - "sponsored-selection.ts"
Cohesion: 0.11
Nodes (28): main(), GET(), AdCandidate, CustomerZone, DeliveryCheck, diagnoseAdDelivery(), evaluateCampaignChecks(), GLOBAL_COOLDOWN_MS (+20 more)

### Community 167 - "api-merchant-statistics-route.test.ts"
Cohesion: 0.20
Nodes (8): findUniqueSubscription, FREE_STATS, getFreeMerchantStats, getInsightPremium, getLockedInsightPlaceholder, REAL_PLACEHOLDER, REAL_PREMIUM, requireMerchantStatsAccess

### Community 168 - "CampagnesPanel"
Cohesion: 0.22
Nodes (4): audienceDisplay(), CampagnesPanel(), CampaignWizard(), statusTone()

### Community 169 - "next"
Cohesion: 0.06
Nodes (14): nextConfig, next, metadata, ContactForm(), SPACES, metadata, viewport, SPACES (+6 more)

### Community 170 - "sponsored-test-broadcast.test.ts"
Cohesion: 0.22
Nodes (8): adFindUnique, adRow, broadcastDelete, broadcastFindUnique, broadcastUpdate, broadcastUpsert, syncAll, walletCount

### Community 172 - "caisse-scan-route.test.ts"
Cohesion: 0.25
Nodes (6): processCaisseScan, processCaisseScanByClientNumber, rateLimit, requireCaisse, requireMutatingRequest, writeAudit

### Community 173 - "card-template-schema.ts"
Cohesion: 0.11
Nodes (20): CardTemplateBackground(), buildCardBackgroundImageStyle(), CardBackgroundSettings, DEFAULT_BACKGROUND, CardDecorativeStyle, cardElementSchema, CardLogoStyle, CardProgressColors (+12 more)

### Community 174 - "campaign-quota.test.ts"
Cohesion: 0.47
Nodes (5): campaignQuotaUsageFindUnique, campaignQuotaUsageUpsert, executeRaw, fakeTx(), merchantSubscriptionFindUnique

### Community 175 - "resolveMediaFilePath"
Cohesion: 0.38
Nodes (5): GET(), MIME, GET(), MIME, resolveMediaFilePath()

### Community 176 - "EmployeeLoginScreen"
Cohesion: 0.40
Nodes (3): EmployeeLoginScreen(), onSubmit(), readApiJson()

### Community 177 - "capture-employe-screenshots.mjs"
Cohesion: 0.67
Nodes (3): main(), outDir, shot()

### Community 178 - "trim-card-images.mjs"
Cohesion: 0.40
Nodes (3): ref_sharp, files, INPUT_DIR

### Community 181 - "avatar-storage.ts"
Cohesion: 0.50
Nodes (4): AVATAR_DIR, MIME_TO_EXT, parseAvatarDataUrl(), saveAvatar()

### Community 182 - "super-admin-ad-detail-page.test.ts"
Cohesion: 0.40
Nodes (4): adRequestFindUnique, getSuperAdminSessionUser, notFound, redirect

## Knowledge Gaps
- **1009 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+1004 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1360 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `loyalty-context.ts`, `rbac.ts`, `employes/ui.tsx`, `click/route.ts`, `react`, `app/ui.tsx`, `merchant-card-template-service.ts`, `merchant-ad-edit.test.ts`, `customer-preferences-route.test.ts`, `super-admin-campaign-moderation.test.ts`, `campaign-moderation-home.tsx`, `fife-life/merchant-detail.tsx`, `merchants-list.tsx`, `session.ts`, `clients/ui.tsx`, `prisma.ts`, `types.ts`, `profile-page.tsx`, `google-auth.ts`, `middleware.ts`, `sponsored-slot.tsx`, `clientIp`, `finalisation/page.tsx`, `demo-routing.test.ts`, `super-admin-ad-moderation.test.ts`, `customer-push-route.test.ts`, `ad-detail.tsx`, `card-editor.tsx`, `package.json`, `[id]/merchant-detail.tsx`, `qa-login/page.tsx`, `ad-visuals.ts`, `sponsored-selection.ts`, `cards-index.tsx`, `scan/ui.tsx`, `api-merchant-statistics-route.test.ts`, `app/statistiques/page.tsx`, `caisse-scan-route.test.ts`, `demo-session.ts`, `src/app/page.tsx`, `resolveMediaFilePath`, `@prisma/client`, `qa-login.ts`, `ref_node_path`, `loyaltyBalanceForMode`, `wallet-home.tsx`, `employee-session.ts`, `demo-mode.ts`, `card-deck.tsx`, `vitest`, `demo-visual.ts`, `lib/campaign-worker.ts`, `marketing-topup-route.test.ts`, `super-admin-session.ts`, `merchant-cards-gallery.tsx`, `firstActiveStaffMembership`, `jsonError`, `campagnes/ui.tsx`, `src/app/layout.tsx`, `cn`, `layout-shell.tsx`, `notifications-center.tsx`, `campaign-crud-routes.test.ts`, `env.ts`, `ad-confirm-route.test.ts`, `campaign-confirm-route.test.ts`, `tarifs/page.tsx`, `customer-layout-guard.ts`?**
  _High betweenness centrality (0.176) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `caisse-scan.ts`, `loyalty-context.ts`, `rbac.ts`, `merchant-card-template-service.ts`, `click/route.ts`, `react`, `loyalty-commit.ts`, `google-wallet/route.ts`, `loyalty-widget-view.tsx`, `loyalty-widget.ts`, `card-editor-properties.tsx`, `merchant-billing.ts`, `cashier-checkout.tsx`, `google-auth.ts`, `middleware.ts`, `demo-routing.test.ts`, `customer-reward-progress.ts`, `card-editor.tsx`, `package.json`, `[id]/merchant-detail.tsx`, `statistiques-panel.tsx`, `customer-onboarding.ts`, `scan/ui.tsx`, `media-storage.ts`, `loyalty-commit.test.ts`, `loyalty-service.ts`, `@prisma/client`, `super-admin.test.ts`, `qa-login.ts`, `ref_node_path`, `loyaltyBalanceForMode`, `email.ts`, `insight-stats.ts`, `sponsored-slot.test.tsx`, `sponsored-test-broadcast.ts`, `wallet-home.tsx`, `platform-stats.ts`, `card-deck.tsx`, `webhook/route.ts`, `stripe-webhook-route.test.ts`, `fake-ad-db.ts`, `merchant-card-renderer.tsx`, `qr-cache.ts`, `lib/campaign-worker.ts`, `marketing-topup-route.test.ts`, `campaign-quota.ts`, `stripe.ts`, `merchant-cards-gallery.tsx`, `ad-visual-journeys.test.ts`, `customer-loyalty-overview.ts`, `src/app/layout.tsx`, `campaign-worker.test.ts`, `campaign-crud-routes.test.ts`, `env.ts`, `ad-confirm-route.test.ts`, `use-wallet-unlock-animation.ts`, `campaign-confirm-route.test.ts`, `sponsored-placements.test.ts`, `tarifs/page.tsx`, `marketing-balance.test.ts`, `employees/[id]/route.ts`, `super-admin-campaign-moderation.test.ts`, `merchant-ad-edit.test.ts`, `landing-page.test.ts`, `customer-preferences-route.test.ts`, `push-client.ts`, `campaign-fixes.test.ts`, `admin-ad-fiche.test.ts`, `google-wallet-media-route.test.ts`, `campaign-test-mode-isolation.test.ts`, `loyalty-service.test.ts`, `employee-invitation-service.ts`, `stripe-webhook-marketing.test.ts`, `super-admin-ad-moderation.test.ts`, `campaign-audience.ts`, `customer-push-route.test.ts`, `caisse-scan.test.ts`, `qr.ts`, `api-merchant-statistics-route.test.ts`, `sponsored-test-broadcast.test.ts`, `caisse-scan-route.test.ts`, `campaign-quota.test.ts`, `super-admin-ad-detail-page.test.ts`?**
  _High betweenness centrality (0.148) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `@prisma/client` to `loyalty-context.ts`, `rbac.ts`, `merchant-card-template-service.ts`, `employes/ui.tsx`, `click/route.ts`, `employees/[id]/route.ts`, `loyalty-commit.ts`, `loyalty-widget.ts`, `customer-qr.ts`, `card-editor-properties.tsx`, `merchant-billing.ts`, `session.ts`, `ads/[id]/confirm/route.ts`, `loyalty-service.test.ts`, `prisma.ts`, `cashier-checkout.tsx`, `types.ts`, `profile-page.tsx`, `employee-invitation-service.ts`, `requireSuperAdmin`, `clientIp`, `campaign-audience.ts`, `google-auth.ts`, `customer-reward-progress.ts`, `create-super-admin.ts`, `programme/ui.tsx`, `card-editor.tsx`, `qr.ts`, `package.json`, `cards-index.tsx`, `customer-onboarding.ts`, `sponsored-selection.ts`, `scan/ui.tsx`, `loyalty-service.ts`, `card-template-schema.ts`, `super-admin.test.ts`, `qa-login.ts`, `loyaltyBalanceForMode`, `insight-stats.ts`, `sponsored-test-broadcast.ts`, `wallet-home.tsx`, `employee-session.ts`, `platform-stats.ts`, `webhook/route.ts`, `merchant-card-renderer.tsx`, `lib/campaign-worker.ts`, `campaign-quota.ts`, `stripe.ts`, `super-admin-session.ts`, `merchant-cards-gallery.tsx`, `jsonError`, `customer-loyalty-overview.ts`, `google-wallet.ts`, `env.ts`, `use-wallet-unlock-animation.ts`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _1009 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `loyalty-context.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11008325624421832 - nodes in this community are weakly interconnected._
- **Should `rbac.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11742424242424243 - nodes in this community are weakly interconnected._
- **Should `merchant-card-template-service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07706766917293233 - nodes in this community are weakly interconnected._