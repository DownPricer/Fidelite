# Graph Report - Cartefidelité  (2026-10-03)

## Corpus Check
- 712 files · ~4,803,849 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: (none) 6, .example 4, .css 4)

## Summary
- 3962 nodes · 12348 edges · 191 communities (158 shown, 33 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 48 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `549a96a9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- caisse-scan.ts
- @prisma/client
- rbac.ts
- merchant-card-template-service.ts
- click/route.ts
- next
- loyalty-engine.ts
- firstActiveStaffMembership
- tarifs/page.tsx
- loyalty-widget-view.tsx
- loyalty-widget.ts
- validation.ts
- VisualPicker
- card-editor-properties.tsx
- jsonOk
- campaign-lifecycle.ts
- merchant-billing.ts
- merchant-app-access.ts
- cn
- prisma
- clients/ui.tsx
- jsonError
- dashboard-home.tsx
- google-wallet.ts
- google-auth.ts
- middleware.ts
- readJson
- clientIp
- fiche.tsx
- SettingsPanel
- customer-reward-progress.ts
- create-super-admin.ts
- programme/ui.tsx
- card-editor.tsx
- package.json
- google-wallet-media-crop.tsx
- statistiques-panel.tsx
- ad-visuals.ts
- customer-onboarding.ts
- What You Must Do When Invoked
- scan/ui.tsx
- media-storage.ts
- loyalty-commit.test.ts
- insight-period.ts
- loyalty-commit.ts
- demo-session.ts
- src/app/page.tsx
- compilerOptions
- wallet-event-dedup.ts
- loyalty-program.ts
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
- wallet-hydration.test.tsx
- employee-session.ts
- scripts
- facturation/ui.tsx
- platform-stats.ts
- demo-mode.ts
- types.ts
- ref_fs
- webhook/route.ts
- stripe-webhook-route.test.ts
- fake-ad-db.ts
- session.ts
- merchant-card-renderer.tsx
- AdvantagesEditor
- merchant/ads/route.ts
- isGoogleSignInEnabled
- unsubscribe-token.ts
- marketing-topup-route.test.ts
- campaign-quota.ts
- stripe.ts
- super-admin-session.ts
- cartes.js
- Fideto
- docker-entrypoint.sh
- qr.ts
- merchant-ui.tsx
- ad-visual-journeys.test.ts
- Notes pour le prochain agent - Carousel de cartes
- Cartes de fidélité — pack pour Cursor
- demo.js
- prisma.ts
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
- generate-pwa-icons.mjs
- graphify reference: query, path, explain
- campaign-worker.test.ts
- AdDetailPage
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
- events/route.ts
- campaign-confirm-route.test.ts
- sponsored-placements.test.ts
- app/app/connexion/page.tsx
- customer-layout-guard.ts
- sponsored-hours-pricing.ts
- marketing-balance.test.ts
- lib/campaign-worker.ts
- api-merchant-statistics-route.test.ts
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
- caisse-scan-route.test.ts
- [kind]/route.ts
- use-wallet-unlock-animation.ts
- campaign-test-mode-isolation.test.ts
- loyalty-service.test.ts
- verify-viewports.mjs
- caisse-scan.test.ts
- employee-invitation-service.ts
- preview-data.ts
- vitest
- super-admin-ad-moderation.test.ts
- sponsored-slot.tsx
- finalisation/page.tsx
- ads/[id]/confirm/route.ts
- loyalty-cards-capture.mjs
- push.ts
- customer-push-route.test.ts
- ad-detail.tsx
- FakeIntersectionObserver
- employe/layout.tsx
- CreateMerchantWizard
- qa-login/page.tsx
- card-deck-interaction.test.ts
- sponsored-selection.ts
- ad-lifecycle-worker.ts
- landing-footer.tsx
- EmployeeLoginScreen
- app/statistiques/page.tsx
- landing-header.tsx
- card-template-schema.ts
- campaign-quota.test.ts
- landing-faq.tsx
- landing-merchant-preview.tsx
- campaign-audience.ts
- super-admin/layout.tsx
- use-media-query.ts
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
1. `jsonError()` - 257 edges
2. `jsonOk()` - 223 edges
3. `next` - 161 edges
4. `requireMutatingRequest()` - 160 edges
5. `prisma` - 147 edges
6. `vitest` - 122 edges
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

## Communities (191 total, 33 thin omitted)

### Community 0 - "caisse-scan.ts"
Cohesion: 0.25
Nodes (10): buildScanResult(), CaisseScanError, maskClientNumberForLog(), findUserByCustomerNumber(), processCaisseScan(), processCaisseScanByClientNumber(), CAISSE_GRANT_TTL_MS, logWalletUnlock() (+2 more)

### Community 1 - "@prisma/client"
Cohesion: 0.10
Nodes (38): @prisma/client, dynamic, MerchantProfilePage(), formatAddress(), MerchantProfile(), join(), MerchantProfileData, safeExternalUrl() (+30 more)

### Community 2 - "rbac.ts"
Cohesion: 0.16
Nodes (13): CustomerDetailPage(), ClientsPage(), assertCanAddEmployee(), canAddEmployee(), canAdjustPoints(), canViewAllCustomers(), MAX_ACTIVE_EMPLOYEES, staffHasPermission() (+5 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.06
Nodes (61): GET(), JoinMerchantPage(), ALL_SLOTS, cardCounts(), CardsIndexPage(), hasPublishedActiveSlot(), MerchantCardRow, modeLabel() (+53 more)

### Community 4 - "click/route.ts"
Cohesion: 0.31
Nodes (5): GET(), GET(), isSafeAdUrl(), adEventCreate, adRequestFindUnique

### Community 5 - "next"
Cohesion: 0.05
Nodes (37): nextConfig, next, react, Merchant, MerchantPublic(), CustomerLoginForm(), googleMessage(), recoverMessage() (+29 more)

### Community 6 - "loyalty-engine.ts"
Cohesion: 0.16
Nodes (18): block(), EarnEvaluation, EarnHistory, evaluateEarn(), formatDurationMinutes(), LoyaltyAction, LoyaltyBlock, minutesBetween() (+10 more)

### Community 7 - "firstActiveStaffMembership"
Cohesion: 0.25
Nodes (19): CampagneFichePage(), CampagnesPage(), SoldeMarketingPage(), EmployeeDetailPage(), EmployeesPage(), FidelisationPage(), FacturationPage(), OutilsPage() (+11 more)

### Community 8 - "tarifs/page.tsx"
Cohesion: 0.18
Nodes (9): HomePage(), FIDETO_MONTHLY, metadata, PACK_SETUP, TarifsPage(), PricingFaq(), QUESTIONS, resolveLandingAuthTargets() (+1 more)

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.07
Nodes (34): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetProgress, LoyaltyWidgetProgressInput, LoyaltyWidgetView(), pct() (+26 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.07
Nodes (50): LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), dedupeIssues(), EditorValidationIssue, EditorValidationSummary, missingWidgetLabel(), publishValidationResult(), summarizeEditorValidation() (+42 more)

### Community 11 - "validation.ts"
Cohesion: 0.05
Nodes (44): zod, POST(), schema, FILTER_MAP, GET(), POST(), schema, DELETE() (+36 more)

### Community 12 - "VisualPicker"
Cohesion: 0.19
Nodes (13): deleteCampaignMediaUrl(), loadImageElement(), readFileAsDataUrl(), SelfVisualCropper(), uploadCampaignMedia(), VisualPicker(), dropSelfFiles(), onCropConfirm() (+5 more)

### Community 13 - "card-editor-properties.tsx"
Cohesion: 0.07
Nodes (65): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, GuideLine, handlesForElement() (+57 more)

### Community 14 - "jsonOk"
Cohesion: 0.10
Nodes (41): DELETE(), POST(), POST(), POST(), PATCH(), DELETE(), POST(), GET() (+33 more)

### Community 15 - "campaign-lifecycle.ts"
Cohesion: 0.50
Nodes (6): isCancellable(), isDuplicable(), requiresModeration(), statusAfterFundingConfirmed(), statusAfterModerationApproved(), statusAfterModerationRejected()

### Community 16 - "merchant-billing.ts"
Cohesion: 0.10
Nodes (29): GET(), attachReceipts(), BillingError, CANCELLABLE, CancellationPreview, effectiveEndDate(), InvoicesResult, listMerchantInvoices() (+21 more)

### Community 17 - "merchant-app-access.ts"
Cohesion: 0.24
Nodes (11): CaissePage(), DashboardLayout(), hasMerchantStaffAccess(), isMerchantAppPublicPath(), MERCHANT_APP_PUBLIC_PATHS, MerchantAppAccess, resolveMerchantAppAccess(), shouldRedirectAppToEmployeeSpace() (+3 more)

### Community 18 - "cn"
Cohesion: 0.06
Nodes (36): DashboardLayout(), SubscriptionsPage(), load(), toggleInsight(), MEDIA_TO_APPEARANCE_KEY, RECOMMENDED_WALLET_COLORS, WalletAppearance, WalletMediaKey (+28 more)

### Community 19 - "prisma"
Cohesion: 0.09
Nodes (34): GET(), POST(), schema, GET(), PATCH(), applyStatus(), PROPOSABLE, schema (+26 more)

### Community 20 - "clients/ui.tsx"
Cohesion: 0.16
Nodes (14): Customer, CustomerDetail, CustomerDetailPanel(), CustomerInsight, CustomersPanel(), CustomerStats, CustomerTx, DEMO (+6 more)

### Community 21 - "jsonError"
Cohesion: 0.06
Nodes (54): GET(), PATCH(), GET(), POST(), dynamic, GET(), dynamic, GET() (+46 more)

### Community 22 - "dashboard-home.tsx"
Cohesion: 0.13
Nodes (13): recharts, ACTIVITY_LABELS, DashboardHome(), formatEuros(), Overview, QUICK_LINKS, SuperAdminPage(), SuperAdminStatsPage() (+5 more)

### Community 23 - "google-wallet.ts"
Cohesion: 0.06
Nodes (87): google-auth-library, accessToken(), fail(), main(), ok(), pngSize(), ensureWalletClassRecord(), parseWalletAction() (+79 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.14
Nodes (25): GET(), GET(), isGoogleAuthConfigured(), consumeGoogleCallback(), createGoogleAuthUrl(), decodeStateCookie(), encodeStateCookie(), GOOGLE_SCOPES (+17 more)

### Community 25 - "middleware.ts"
Cohesion: 0.15
Nodes (23): hostMatches(), hostnameOf(), isAdminHost(), isAppHost(), isCustomerHost(), isEmployeeHost(), isLocalHost(), legacyRedirectOrigin() (+15 more)

### Community 26 - "readJson"
Cohesion: 0.14
Nodes (30): POST(), POST(), POST(), POST(), logScanBody(), POST(), scanVia(), POST() (+22 more)

### Community 27 - "clientIp"
Cohesion: 0.09
Nodes (53): POST(), POST(), schema, POST(), POST(), GET(), POST(), POST() (+45 more)

### Community 28 - "fiche.tsx"
Cohesion: 0.12
Nodes (19): AdStatus, Detail, euros(), HistoryRow, PaymentPreview, PayMethod, STATUS_LABELS, block (+11 more)

### Community 30 - "customer-reward-progress.ts"
Cohesion: 0.12
Nodes (27): buildTargetView(), getCustomerMerchantRewardProgress(), resolveVisualState(), MerchantRewardProgressTarget, REWARD_ALMOST_THRESHOLD_PERCENT, RewardProgressVisualState, progressLineForTarget(), evaluateCustomerRewards() (+19 more)

### Community 31 - "create-super-admin.ts"
Cohesion: 0.50
Nodes (4): bcryptjs, main(), prisma, required()

### Community 32 - "programme/ui.tsx"
Cohesion: 0.07
Nodes (32): DEMO_CONFIG, HistoricalEntitlement, DEMO_CONFIG, MODES, modeTitle(), PROGRAM_STEPS, ProgramConfigurator(), goToStep() (+24 more)

### Community 33 - "card-editor.tsx"
Cohesion: 0.10
Nodes (36): buildElementCatalog(), CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction() (+28 more)

### Community 34 - "package.json"
Cohesion: 0.08
Nodes (24): description, engines, node, name, prisma, seed, private, version (+16 more)

### Community 35 - "google-wallet-media-crop.tsx"
Cohesion: 0.24
Nodes (12): GoogleWalletMediaCrop(), confirm(), onPointerMove(), patchState(), centeredCropState(), clampCropState(), computeCoverCrop(), CropState (+4 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.09
Nodes (32): ApiResponse, COMPARISON_METRICS, FideliteTab(), FinancesTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder (+24 more)

### Community 37 - "ad-visuals.ts"
Cohesion: 0.10
Nodes (34): GET(), GET(), AD_SOURCE_MAX_IMAGES, AD_VISUAL_EXPORT_PX, AD_VISUAL_MAX_BYTES, AD_VISUAL_MAX_PX, AD_VISUAL_MIN_PX, AD_VISUAL_RATIO (+26 more)

### Community 38 - "customer-onboarding.ts"
Cohesion: 0.16
Nodes (22): invalidateCustomerAccessTokens(), issueCustomerAccessToken(), beginCustomerOnboarding(), buildAccountRecoveryUrl(), buildEmailVerificationUrl(), CustomerAccessLevel, CustomerOnboardingUser, FINALIZATION_PATH_PREFIXES (+14 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "scan/ui.tsx"
Cohesion: 0.06
Nodes (56): GET(), ADMIN_PERMISSIONS, CaisseScreen(), ScanResult, EmployeeScanPage(), EmployeeProfile, EmployeeScanScreen(), Phase (+48 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.14
Nodes (26): appearanceKeyForGoogleWalletMedia(), assertExactDimensions(), assertPublishedGoogleWalletMediaReadable(), deleteCardBackground(), getUploadsRoot(), GoogleWalletMediaKind, GoogleWalletPublicMediaKind, GoogleWalletPublishedMediaConfig (+18 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "insight-period.ts"
Cohesion: 0.20
Nodes (25): addParisDays(), addParisMonths(), bucketKey(), enumerateBucketKeys(), enumerateDayKeys(), enumerateMonthKeys(), enumerateWeekKeys(), InsightBucket (+17 more)

### Community 44 - "loyalty-commit.ts"
Cohesion: 0.08
Nodes (47): AmountField(), press(), KEYS, CashierCheckout(), askRedeem(), commitEarn(), confirmRedeem(), Phase (+39 more)

### Community 45 - "demo-session.ts"
Cohesion: 0.12
Nodes (20): GET(), GET(), GET(), GET(), GET(), CLIENT_DEMO_COOKIE, demoCookieNamesForRole(), demoEnterTarget() (+12 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.11
Nodes (25): BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, MERCHANT_BENEFITS, metadata, PROOF_ITEMS, ArrowRightIcon(), base (+17 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "wallet-event-dedup.ts"
Cohesion: 0.18
Nodes (19): useWalletEvents(), connect(), disconnect(), onVisibility(), canUseSessionStorage(), getStoredLastEventId(), hasAnimatedCard(), hasSeenWalletEvent() (+11 more)

### Community 49 - "loyalty-program.ts"
Cohesion: 0.09
Nodes (33): AmountTier, AppliedTier, computeEarn(), normalizeThresholdUnit(), parseRewardConditionsField(), ProgramConfig, activeEligibleRewards(), assertRewardLimit() (+25 more)

### Community 50 - "super-admin.test.ts"
Cohesion: 0.16
Nodes (18): BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr(), sumCollectedRevenue() (+10 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.10
Nodes (35): ref_crypto, assertNoUnknownArgs(), main(), parseTtlMinutes(), cookieOptions(), createEmployeeSession(), destroyEmployeeSession(), assertQaLoginTtlMinutes() (+27 more)

### Community 52 - "ref_node_path"
Cohesion: 0.07
Nodes (20): ref_node_fs, ref_node_path, playwright, outDir, pages, OUT, OUT, shots (+12 more)

### Community 53 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+11 more)

### Community 54 - "loyaltyBalanceForMode"
Cohesion: 0.16
Nodes (24): main(), dynamic, GET(), CarteIndexPage(), dynamic, CardPage(), dynamic, deriveClientNumber() (+16 more)

### Community 55 - "email.ts"
Cohesion: 0.17
Nodes (26): nodemailer, ContactPage(), buildCampaignEmailContent(), buildCustomerFinalizationContent(), buildInvitationContent(), CampaignEmailInput, CustomerFinalizationEmailInput, emailConfigHint() (+18 more)

### Community 56 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, eslint-config-next, happy-dom, playwright, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+8 more)

### Community 57 - "insight-stats.ts"
Cohesion: 0.09
Nodes (35): GET(), PERIOD_KEYS, requireMerchantStatsAccess(), InsightPeriodKey, InsightRange, buildFinancial(), buildOverview(), buildRetention() (+27 more)

### Community 58 - "sponsored-slot.test.tsx"
Cohesion: 0.18
Nodes (8): MobilePlacementPreview(), AD, calls, flush(), mount(), Observer, observers, roots

### Community 59 - "resolveMediaFilePath"
Cohesion: 0.38
Nodes (5): GET(), MIME, GET(), MIME, resolveMediaFilePath()

### Community 60 - "wallet-hydration.test.tsx"
Cohesion: 0.07
Nodes (28): motion, react-dom, CardsSheet(), DiscoverPage(), Merchant, ExpandableQrCode(), handleActivate(), openQr() (+20 more)

### Community 61 - "employee-session.ts"
Cohesion: 0.19
Nodes (14): EmployeeLoginPage(), ProEntryPage(), canEmployeeAccess(), employeeCookieName(), employeeFromToken(), employeeFromTokenWithReason(), EmployeeSession, employeeTokenFromRequest() (+6 more)

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
Cohesion: 0.19
Nodes (13): CaisseAliasPage(), EmployeeHomePage(), EMPLOYEE_DEMO_COOKIE, isClientDemoMode(), isDemoCookie(), isPublicDemoEnabled(), MERCHANT_DEMO_COOKIE, src_lib_employee_demo_employee_demo_cookie (+5 more)

### Community 66 - "types.ts"
Cohesion: 0.06
Nodes (53): activeCardFromDeck(), CardDeck(), handleDragEnd(), handleKeyDown(), snapTo(), DeckItem, demoStartIndex(), readDeckMetrics() (+45 more)

### Community 67 - "ref_fs"
Cohesion: 0.07
Nodes (23): ref_fs, ref_path, main(), outDir, shot(), outDir, main(), outDir (+15 more)

### Community 68 - "webhook/route.ts"
Cohesion: 0.09
Nodes (24): handleChargeRefunded(), handleCheckoutSessionCompleted(), handleCheckoutSessionExpired(), handlePaymentIntentFailed(), handleStripeEvent(), paymentIntentIdOf(), POST(), refundIncludedQuota() (+16 more)

### Community 69 - "stripe-webhook-route.test.ts"
Cohesion: 0.11
Nodes (15): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindFirst, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent (+7 more)

### Community 70 - "fake-ad-db.ts"
Cohesion: 0.13
Nodes (18): END, fake, h, previewCall(), START, END, fake, START (+10 more)

### Community 71 - "session.ts"
Cohesion: 0.11
Nodes (28): GET(), GET(), CarteIdentitePage(), AccountPage(), ParametresPage(), dynamic, NotificationsPage(), PREVIEW_BENEFITS (+20 more)

### Community 72 - "merchant-card-renderer.tsx"
Cohesion: 0.15
Nodes (30): COMPACT_HIDDEN, displayClientName(), elementShellStyle(), ElementView(), MerchantCardDisplayMode, MerchantCardRenderer(), MerchantCardRendererProps, resolveDisplayQrSrc() (+22 more)

### Community 73 - "AdvantagesEditor"
Cohesion: 0.26
Nodes (16): AdvantagesEditor(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward(), openEditReward() (+8 more)

### Community 74 - "merchant/ads/route.ts"
Cohesion: 0.22
Nodes (15): DELETE(), EDITABLE_STATUSES, GET(), PATCH(), GET(), POST(), POST(), schema (+7 more)

### Community 75 - "isGoogleSignInEnabled"
Cohesion: 0.38
Nodes (4): CustomerLoginPage(), CustomerSignupPage(), CustomerSignupForm(), isGoogleSignInEnabled()

### Community 76 - "unsubscribe-token.ts"
Cohesion: 0.24
Nodes (9): jose, secretKey(), signUnsubscribeToken(), UnsubscribePayload, UnsubscribeTokenError, unsubscribeUrl(), verifyUnsubscribeToken(), consentEventCreateMany (+1 more)

### Community 77 - "marketing-topup-route.test.ts"
Cohesion: 0.20
Nodes (8): createMarketingTopupCheckoutSession, FakeStripeNotConfiguredError, ledgerCreate, ledgerUpdate, requireMerchantAdmin, requireMutatingRequest, stripeMode, writeAudit

### Community 78 - "campaign-quota.ts"
Cohesion: 0.21
Nodes (20): computeAdPricing(), POST(), GET(), GET(), consumeQuotaForCampaign(), planAndRemainingQuota(), priceMemberOrNetworkCampaign(), priceSponsoredAd() (+12 more)

### Community 79 - "stripe.ts"
Cohesion: 0.10
Nodes (28): stripe, BillingCustomerInput, billingParams(), CampaignCheckoutInput, checkoutExpiry(), clientForMode(), clients, createBillingPortalSession() (+20 more)

### Community 80 - "super-admin-session.ts"
Cohesion: 0.08
Nodes (27): SuperAdminSubscriptionsPage(), AuditPage(), SuperAdminAuditPage(), DiagnosticPage(), SuperAdminDiagnosticPage(), SuperAdminAdDetailPage(), SuperAdminCampagnesPage(), MerchantCardsPage() (+19 more)

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
Cohesion: 0.26
Nodes (10): main(), prisma, requiredEnv(), upsertEmployee(), assertQrUsable(), QrError, QrPayload, secretKey() (+2 more)

### Community 85 - "merchant-ui.tsx"
Cohesion: 0.08
Nodes (25): DEMO, Employee, EmployeeDetailPanel(), patchEmployee(), reactivate(), resendInvite(), saveProfile(), suspend() (+17 more)

### Community 86 - "ad-visual-journeys.test.ts"
Cohesion: 0.14
Nodes (15): submit(), adminPropose(), createAd(), ctx(), dataUrl(), fake, h, jsonRequest() (+7 more)

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "prisma.ts"
Cohesion: 0.07
Nodes (43): POST(), POST(), schema, GET(), POST(), dynamic, GET(), GET() (+35 more)

### Community 93 - "campagnes/ui.tsx"
Cohesion: 0.04
Nodes (41): historyDateKey(), HistoryFilter, matchesFilter(), SoldeMarketingPanel(), topup(), AD_STATUS_LABELS, AdRequest, AdStatus (+33 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "wallet-home.tsx"
Cohesion: 0.06
Nodes (46): AddToGoogleWalletButton(), DiscoverIconLink(), NotificationBellLink(), CustomerProgramView, DETAIL_TABS, DetailTabId, EMPTY_RECENT_ACTIVITY, MerchantCardDetail() (+38 more)

### Community 102 - "MerchantCampaignFiche"
Cohesion: 0.35
Nodes (10): api(), MerchantCampaignFiche(), addSources(), onFile(), onFramed(), post(), onFileChosen(), isExactBanner() (+2 more)

### Community 103 - "profile-page.tsx"
Cohesion: 0.06
Nodes (38): next-themes, src_app_globals, dynamic, manrope, metadata, viewport, AvatarFileInput(), AvatarPreviewEditor() (+30 more)

### Community 104 - "loyalty-service.ts"
Cohesion: 0.17
Nodes (16): applyAdjustment(), applyEarnVisit(), applyRedeemReward(), incrementBalanceData(), legacyPointsForUnitBalance(), LoyaltyBalanceFields, setActiveBalanceData(), computeLoyalty() (+8 more)

### Community 105 - "generate-pwa-icons.mjs"
Cohesion: 0.16
Nodes (12): ref_node_buffer, ref_node_url, ref_node_zlib, outDir, outFile, root, chunk(), color (+4 more)

### Community 106 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 107 - "campaign-worker.test.ts"
Cohesion: 0.12
Nodes (15): baseCampaign, campaignDeliveryCount, campaignDeliveryCreateMany, campaignDeliveryFindMany, campaignDeliveryUpdate, campaignUpdate, customerMembershipFindMany, customerPreferencesFindMany (+7 more)

### Community 108 - "AdDetailPage"
Cohesion: 0.22
Nodes (12): AdDetailPage(), confirmReason(), patch(), requestSend(), run(), sendProposal(), api(), formatCents() (+4 more)

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
Cohesion: 0.13
Nodes (11): dynamic, robots(), dynamic, sitemap(), assertSameOrigin(), CsrfError, employeeCookieName(), employeeTokenFromRequest() (+3 more)

### Community 121 - "ad-confirm-route.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindFirst, adRequestUpdate, adRequestUpdateMany, campaignUpdate, createCampaignCheckoutSession, executeRaw, FakeStripeNotConfiguredError, getQuotaUsage (+5 more)

### Community 122 - "events/route.ts"
Cohesion: 0.26
Nodes (10): dynamic, GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), runtime, sseChunk(), shouldSendSseEvent() (+2 more)

### Community 123 - "campaign-confirm-route.test.ts"
Cohesion: 0.12
Nodes (17): baseCampaign, campaignFindFirst, campaignUpdate, campaignUpdateMany, debitForCampaign, estimateMerchantMembersAudience, estimateNetworkLocalAudience, getMarketingBalanceCents (+9 more)

### Community 124 - "sponsored-placements.test.ts"
Cohesion: 0.18
Nodes (15): GET(), previewResponse(), staffContext(), loadAdPreviewCard(), parsePlacement(), selectSponsoredForCustomer(), click(), END (+7 more)

### Community 125 - "app/app/connexion/page.tsx"
Cohesion: 0.39
Nodes (6): AppLoginPage(), formatEurosFromCents(), isMerchantPlanId(), MERCHANT_PLANS, MerchantPlan, MerchantPlanId

### Community 126 - "customer-layout-guard.ts"
Cohesion: 0.33
Nodes (7): CarteLayout(), CompteLayout(), NotificationsLayout(), enforceCustomerWalletAccess(), customerWalletGuardRedirect(), isFinalizationAllowedPath(), runCustomerOnboardingSideEffects()

### Community 127 - "sponsored-hours-pricing.ts"
Cohesion: 0.12
Nodes (25): addDaysToDateInput(), defaultSlotFor(), firstSelectableDate(), HourlySchedulePicker(), addDay(), hoursToSlots(), scheduleDayError(), slotAmountCents() (+17 more)

### Community 128 - "marketing-balance.test.ts"
Cohesion: 0.31
Nodes (7): Entry, makeTx(), Mode, snapshot(), state, transaction(), uniqueViolation()

### Community 129 - "lib/campaign-worker.ts"
Cohesion: 0.30
Nodes (11): backoffMinutesForAttempt(), claimNextScheduledCampaign(), deliveryChannelsFor(), finalizeCampaignIfComplete(), materializeDeliveries(), processPendingDeliveries(), runWorkerTick(), sendOneDelivery() (+3 more)

### Community 130 - "api-merchant-statistics-route.test.ts"
Cohesion: 0.20
Nodes (8): findUniqueSubscription, FREE_STATS, getFreeMerchantStats, getInsightPremium, getLockedInsightPlaceholder, REAL_PLACEHOLDER, REAL_PREMIUM, requireMerchantStatsAccess

### Community 131 - "app/ui.tsx"
Cohesion: 0.18
Nodes (6): HomeStats, KPI_ICONS, MerchantHome(), QUICK_ACTIONS, StatsPreview, TrendMetric

### Community 132 - "employees/[id]/route.ts"
Cohesion: 0.16
Nodes (19): POST(), DELETE(), GET(), mapEmployee(), PATCH(), employeeLoginUrl(), GET(), mapEmployee() (+11 more)

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
Cohesion: 0.14
Nodes (12): ref_sharp, files, INPUT_DIR, adminStage(), createAd(), ctx(), fake, h (+4 more)

### Community 143 - "caisse-scan-route.test.ts"
Cohesion: 0.25
Nodes (6): processCaisseScan, processCaisseScanByClientNumber, rateLimit, requireCaisse, requireMutatingRequest, writeAudit

### Community 144 - "[kind]/route.ts"
Cohesion: 0.24
Nodes (5): ref_os, GET(), notFound(), loadRoute(), PNG_BYTES

### Community 145 - "use-wallet-unlock-animation.ts"
Cohesion: 0.26
Nodes (13): isDocumentVisible(), UnlockRevealPhase, useWalletUnlockAnimation(), flushWhenVisible(), markWalletEventSeen(), fetchUnlockCardDetail(), cardFromUnlockEvent(), canEnqueueUnlockEvent() (+5 more)

### Community 146 - "campaign-test-mode-isolation.test.ts"
Cohesion: 0.13
Nodes (14): adEventCreate, adRequestFindMany, adRequestFindUnique, campaignDeliveryCreateMany, campaignUpdate, customerMembershipFindMany, customerPreferencesFindMany, inAppNotificationCreate (+6 more)

### Community 147 - "loyalty-service.test.ts"
Cohesion: 0.14
Nodes (13): activeProgram, baseMembership, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeLedgerCreate, loyaltyProgramFindUnique (+5 more)

### Community 149 - "caisse-scan.test.ts"
Cohesion: 0.13
Nodes (14): caisseGrantCreate, customerMembershipCreate, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeQrTokenFindUnique, fifeLifeQrTokenUpdate (+6 more)

### Community 150 - "employee-invitation-service.ts"
Cohesion: 0.21
Nodes (16): buildInvitationLink(), createInvitationToken(), hashInvitationToken(), INVITATION_ERROR, invitationExpiryDate(), isInvitationExpired(), acceptInvitationWithPassword(), createMembershipInvitation() (+8 more)

### Community 151 - "preview-data.ts"
Cohesion: 0.14
Nodes (12): PREVIEW_CARDS, PREVIEW_PREFERENCES, PREVIEW_PROFILE, resetQrCache(), BenefitEntry, formatLoyaltyEntry(), HistoryCategory, HistoryEntry (+4 more)

### Community 152 - "vitest"
Cohesion: 0.07
Nodes (19): vitest, root, root, inAppNotificationCount, inAppNotificationFindMany, inAppNotificationUpdateMany, requireMutatingRequest, requireUser (+11 more)

### Community 153 - "super-admin-ad-moderation.test.ts"
Cohesion: 0.22
Nodes (6): adRequestFindUnique, adRequestUpdate, campaignUpdate, requireMutatingRequest, requireSuperAdmin, writeAudit

### Community 154 - "sponsored-slot.tsx"
Cohesion: 0.23
Nodes (11): IMAGE_CLASS, SponsoredAd, SponsoredBanner(), SponsoredVariant, getDismissedAds(), rememberDismissed(), reportedThisSession, resetSponsoredSessionState() (+3 more)

### Community 155 - "finalisation/page.tsx"
Cohesion: 0.27
Nodes (6): FinalisationPage(), FinalisationForm(), isSmsConfigured(), sendSms(), smsConfigHint(), SmsSendResult

### Community 156 - "ads/[id]/confirm/route.ts"
Cohesion: 0.22
Nodes (19): billingCustomer(), GET(), InsufficientBalance, pendingCheckout(), POST(), QuotaExhausted, GET(), debitForCampaign() (+11 more)

### Community 157 - "loyalty-cards-capture.mjs"
Cohesion: 0.40
Nodes (3): goto(), OUT, tiers

### Community 158 - "push.ts"
Cohesion: 0.29
Nodes (8): web-push, isWebPushConfigured(), ensureConfigured(), PushPayload, PushSendResult, sendPushToSubscription(), sendPushToUser(), WebPushNotConfiguredError

### Community 159 - "customer-push-route.test.ts"
Cohesion: 0.33
Nodes (4): pushSubscriptionDeleteMany, pushSubscriptionUpsert, requireMutatingRequest, requireUser

### Community 160 - "ad-detail.tsx"
Cohesion: 0.12
Nodes (16): AdRequestDetail, AdStatus, AUDIT_LABELS, AuditRow, Delivery, Draft, Journey, PLACEMENT_LABELS (+8 more)

### Community 163 - "CreateMerchantWizard"
Cohesion: 0.50
Nodes (3): CreateMerchantWizard(), goNext(), stepError()

### Community 164 - "qa-login/page.tsx"
Cohesion: 0.38
Nodes (4): dynamic, QaLoginPage(), QaLoginClient(), readFragmentToken()

### Community 165 - "card-deck-interaction.test.ts"
Cohesion: 0.43
Nodes (4): handleCardExpand(), CARD_NO_EXPAND_SELECTOR, shouldIgnoreCardExpand(), shouldProceedWithCardExpand()

### Community 166 - "sponsored-selection.ts"
Cohesion: 0.12
Nodes (28): main(), AdCandidate, CustomerZone, DeliveryCheck, diagnoseAdDelivery(), evaluateCampaignChecks(), GLOBAL_COOLDOWN_MS, IMPRESSION_DEDUPE_MS (+20 more)

### Community 168 - "ad-lifecycle-worker.ts"
Cohesion: 0.33
Nodes (8): log(), loop(), requestShutdown(), sleep(), computeAdLifecycleStatus(), runAdLifecycleTick(), isWithinUtcIntervals(), UtcInterval

### Community 169 - "landing-footer.tsx"
Cohesion: 0.67
Nodes (3): COLUMNS, isInternalPath(), LandingFooter()

### Community 170 - "EmployeeLoginScreen"
Cohesion: 0.40
Nodes (3): EmployeeLoginScreen(), onSubmit(), readApiJson()

### Community 171 - "app/statistiques/page.tsx"
Cohesion: 0.20
Nodes (8): heatmap, INSIGHT_DEMO_RESPONSE, StatistiquesPage(), canViewStatistics(), admin, cashier, grantedCashier, manager

### Community 172 - "landing-header.tsx"
Cohesion: 0.32
Nodes (6): MoonIcon(), SunIcon(), isInternalRoute(), LandingHeader(), NAV_LINKS, ThemeToggle()

### Community 173 - "card-template-schema.ts"
Cohesion: 0.09
Nodes (20): CardTemplateBackground(), CardEditorBackgroundCrop(), buildCardBackgroundImageStyle(), CardBackgroundSettings, DEFAULT_BACKGROUND, CardDecorativeStyle, cardElementSchema, CardLogoStyle (+12 more)

### Community 174 - "campaign-quota.test.ts"
Cohesion: 0.47
Nodes (5): campaignQuotaUsageFindUnique, campaignQuotaUsageUpsert, executeRaw, fakeTx(), merchantSubscriptionFindUnique

### Community 175 - "landing-faq.tsx"
Cohesion: 0.40
Nodes (4): PlusIcon(), FAQ_ITEMS, FaqItem, LandingFaq()

### Community 176 - "landing-merchant-preview.tsx"
Cohesion: 0.50
Nodes (3): BARS, LandingMerchantPreview(), STATS

### Community 177 - "campaign-audience.ts"
Cohesion: 0.27
Nodes (7): AudienceEstimate, estimatedForChannel(), estimateMerchantMembersAudience(), estimateNetworkLocalAudience(), networkAudienceWhere(), customerMembershipFindMany, customerPreferencesFindMany

## Knowledge Gaps
- **998 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+993 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1349 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `@prisma/client`, `rbac.ts`, `app/ui.tsx`, `click/route.ts`, `merchant-card-template-service.ts`, `api-merchant-statistics-route.test.ts`, `firstActiveStaffMembership`, `tarifs/page.tsx`, `customer-preferences-route.test.ts`, `merchant-ad-edit.test.ts`, `super-admin-campaign-moderation.test.ts`, `campaign-moderation-home.tsx`, `caisse-scan-route.test.ts`, `merchant-app-access.ts`, `cn`, `clients/ui.tsx`, `jsonError`, `dashboard-home.tsx`, `google-auth.ts`, `middleware.ts`, `vitest`, `clientIp`, `finalisation/page.tsx`, `super-admin-ad-moderation.test.ts`, `customer-push-route.test.ts`, `programme/ui.tsx`, `ad-detail.tsx`, `package.json`, `employe/layout.tsx`, `qa-login/page.tsx`, `ad-visuals.ts`, `card-editor.tsx`, `ad-visual-ui-contracts.test.ts`, `scan/ui.tsx`, `landing-footer.tsx`, `app/statistiques/page.tsx`, `landing-header.tsx`, `demo-session.ts`, `src/app/page.tsx`, `super-admin/layout.tsx`, `qa-login.ts`, `loyaltyBalanceForMode`, `resolveMediaFilePath`, `wallet-hydration.test.tsx`, `employee-session.ts`, `demo-mode.ts`, `types.ts`, `ref_fs`, `session.ts`, `unsubscribe-token.ts`, `marketing-topup-route.test.ts`, `super-admin-session.ts`, `merchant-ui.tsx`, `prisma.ts`, `campagnes/ui.tsx`, `wallet-home.tsx`, `profile-page.tsx`, `notifications-center.tsx`, `campaign-crud-routes.test.ts`, `env.ts`, `ad-confirm-route.test.ts`, `campaign-confirm-route.test.ts`, `customer-layout-guard.ts`?**
  _High betweenness centrality (0.197) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `@prisma/client`, `rbac.ts`, `merchant-card-template-service.ts`, `click/route.ts`, `next`, `loyalty-engine.ts`, `tarifs/page.tsx`, `loyalty-widget-view.tsx`, `loyalty-widget.ts`, `card-editor-properties.tsx`, `campaign-lifecycle.ts`, `merchant-billing.ts`, `merchant-app-access.ts`, `google-wallet.ts`, `google-auth.ts`, `middleware.ts`, `customer-reward-progress.ts`, `package.json`, `google-wallet-media-crop.tsx`, `statistiques-panel.tsx`, `customer-onboarding.ts`, `scan/ui.tsx`, `media-storage.ts`, `loyalty-commit.test.ts`, `insight-period.ts`, `loyalty-commit.ts`, `demo-session.ts`, `loyalty-program.ts`, `super-admin.test.ts`, `qa-login.ts`, `loyaltyBalanceForMode`, `email.ts`, `insight-stats.ts`, `sponsored-slot.test.tsx`, `wallet-hydration.test.tsx`, `platform-stats.ts`, `ref_fs`, `webhook/route.ts`, `stripe-webhook-route.test.ts`, `fake-ad-db.ts`, `merchant-card-renderer.tsx`, `unsubscribe-token.ts`, `marketing-topup-route.test.ts`, `campaign-quota.ts`, `stripe.ts`, `qr.ts`, `ad-visual-journeys.test.ts`, `wallet-home.tsx`, `profile-page.tsx`, `loyalty-service.ts`, `campaign-worker.test.ts`, `campaign-crud-routes.test.ts`, `env.ts`, `ad-confirm-route.test.ts`, `campaign-confirm-route.test.ts`, `sponsored-placements.test.ts`, `app/app/connexion/page.tsx`, `marketing-balance.test.ts`, `api-merchant-statistics-route.test.ts`, `employees/[id]/route.ts`, `super-admin-campaign-moderation.test.ts`, `merchant-ad-edit.test.ts`, `landing-page.test.ts`, `customer-preferences-route.test.ts`, `push-client.ts`, `campaign-fixes.test.ts`, `admin-ad-fiche.test.ts`, `caisse-scan-route.test.ts`, `[kind]/route.ts`, `use-wallet-unlock-animation.ts`, `campaign-test-mode-isolation.test.ts`, `loyalty-service.test.ts`, `caisse-scan.test.ts`, `employee-invitation-service.ts`, `preview-data.ts`, `super-admin-ad-moderation.test.ts`, `customer-push-route.test.ts`, `card-deck-interaction.test.ts`, `ad-visual-ui-contracts.test.ts`, `ad-lifecycle-worker.ts`, `app/statistiques/page.tsx`, `campaign-quota.test.ts`, `campaign-audience.ts`?**
  _High betweenness centrality (0.154) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `@prisma/client` to `lib/campaign-worker.ts`, `rbac.ts`, `merchant-card-template-service.ts`, `employees/[id]/route.ts`, `loyalty-engine.ts`, `loyalty-widget.ts`, `customer-qr.ts`, `card-editor-properties.tsx`, `jsonOk`, `campaign-lifecycle.ts`, `merchant-billing.ts`, `merchant-app-access.ts`, `use-wallet-unlock-animation.ts`, `prisma`, `loyalty-service.test.ts`, `jsonError`, `employee-invitation-service.ts`, `preview-data.ts`, `google-auth.ts`, `google-wallet.ts`, `clientIp`, `ads/[id]/confirm/route.ts`, `customer-reward-progress.ts`, `create-super-admin.ts`, `programme/ui.tsx`, `card-editor.tsx`, `package.json`, `customer-onboarding.ts`, `sponsored-selection.ts`, `ad-lifecycle-worker.ts`, `scan/ui.tsx`, `loyalty-commit.ts`, `card-template-schema.ts`, `campaign-audience.ts`, `super-admin.test.ts`, `loyalty-program.ts`, `qa-login.ts`, `loyaltyBalanceForMode`, `insight-stats.ts`, `employee-session.ts`, `platform-stats.ts`, `types.ts`, `session.ts`, `merchant-card-renderer.tsx`, `campaign-quota.ts`, `super-admin-session.ts`, `qr.ts`, `prisma.ts`, `wallet-home.tsx`, `loyalty-service.ts`, `events/route.ts`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _998 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `@prisma/client` be split into smaller, more focused modules?**
  _Cohesion score 0.09879336349924585 - nodes in this community are weakly interconnected._
- **Should `merchant-card-template-service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05859969558599695 - nodes in this community are weakly interconnected._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.05284831846259437 - nodes in this community are weakly interconnected._